import { HexString } from "@cityofzion/neon-core/lib/u";
import { CONST, rpc, wallet, sc, u, tx } from "@cityofzion/neon-core";
import { Signer } from "@cityofzion/neon-core/lib/tx";

export interface CommonConfig {
  networkMagic: number;
  rpcAddress: string;
  prioritisationFee?: number;
  blocksTillExpiry?: number;
  account?: wallet.Account;
}

export async function calculateNetworkFee(
  transaction: tx.Transaction,
  account: wallet.Account,
  config: CommonConfig
): Promise<number> {
  if (transaction.signers.length < 1) {
    throw new Error(
      "Cannot calculate the network fee without a sender in the transaction."
    );
  }

  const hashes = transaction.getScriptHashesForVerifying();
  let networkFeeSize =
    transaction.headerSize +
    u.getSerializedSize(transaction.signers) +
    u.getSerializedSize(transaction.attributes) +
    u.getSerializedSize(transaction.script) +
    u.getSerializedSize(hashes.length);

  let networkFee = 0;
  hashes.map((hash) => {
    let witnessScript;
    if (hash === account.scriptHash && account.contract.script !== undefined) {
      witnessScript = HexString.fromBase64(account.contract.script);
    }

    if (witnessScript === undefined && transaction.witnesses.length > 0) {
      for (const witness of transaction.witnesses) {
        if (witness.scriptHash === hash) {
          witnessScript = witness.verificationScript;
          break;
        }
      }
    }

    if (witnessScript === undefined)
      // should get the contract script via RPC getcontractstate
      // then execute the script with a verification trigger (not yet supported)
      // and collect the gas consumed
      throw new Error(
        "Using a smart contract as a witness is not yet supported in neon-js"
      );
    else if (u.isSignatureContract(witnessScript)) {
      networkFeeSize += 67 + u.getSerializedSize(witnessScript);
      networkFee =
        (sc.OpCodePrices[sc.OpCode.PUSHDATA1] +
          sc.OpCodePrices[sc.OpCode.PUSHDATA1] +
          sc.OpCodePrices[sc.OpCode.PUSHNULL] +
          sc.getInteropServicePrice(
            sc.InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256R1
          )) *
        100_000_000;
    } else if (u.isMultisigContract(witnessScript)) {
      const publicKeyCount = wallet.getPublicKeysFromVerificationScript(
        witnessScript.toString()
      ).length;
      const signatureCount = wallet.getSigningThresholdFromVerificationScript(
        witnessScript.toString()
      );
      const size_inv = 66 * signatureCount;
      networkFeeSize +=
        u.getSerializedSize(size_inv) +
        size_inv +
        u.getSerializedSize(witnessScript);
      networkFee += sc.OpCodePrices[sc.OpCode.PUSHDATA1] * signatureCount;

      const builder = new sc.ScriptBuilder();
      let pushOpcode = sc.fromHex(
        builder.emitPush(signatureCount).build().slice(0, 2)
      );
      // signature count push price
      networkFee += sc.OpCodePrices[pushOpcode];

      // now do the same for the public keys
      builder.reset();
      pushOpcode = sc.fromHex(
        builder.emitPush(publicKeyCount).build().slice(0, 2)
      );
      // publickey count push price
      networkFee += sc.OpCodePrices[pushOpcode];
      networkFee +=
        sc.OpCodePrices[sc.OpCode.PUSHNULL] +
        sc.getInteropServicePrice(
          sc.InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256R1
        ) *
          publicKeyCount;
      networkFee *= 100_000_000;
    }
    // else { // future supported contract types}
  });

  const rpcClient = new rpc.RPCClient(config.rpcAddress);
  try {
    const response = await rpcClient.invokeFunction(
      CONST.NATIVE_CONTRACTS.POLICY,
      "getFeePerByte"
    );
    if (response.state === "FAULT") {
      throw Error;
    }
    const nativeContractPolicyFeePerByte = parseInt(
      response.stack[0].value as string
    );
    networkFee += networkFeeSize * nativeContractPolicyFeePerByte;
  } catch (e) {
    throw new Error(
      `Failed to get 'fee per byte' from Policy contract. Error: ${e}`
    );
  }

  return networkFee;
}

export async function getSystemFee(
  script: HexString,
  config: CommonConfig,
  signers?: Signer[]
): Promise<number> {
  const rpcClient = new rpc.RPCClient(config.rpcAddress);
  try {
    const response = await rpcClient.invokeScript(script.toString(), signers);
    if (response.state === "FAULT") {
      throw Error;
    }
    return u.Fixed8.fromRawNumber(response.gasconsumed).toNumber();
  } catch (e) {
    throw new Error(`Failed to get system fee. Error: ${e}`);
  }
}

export class Nep5Contract {
  public contractHash: HexString;
  protected config: CommonConfig;
  protected rpcClient: rpc.RPCClient;
  private _decimals?: number;
  private _name?: string;
  private _symbol?: string;

  public constructor(contractHash: HexString, config: CommonConfig) {
    this.contractHash = contractHash;
    this.config = config;
    this.rpcClient = new rpc.RPCClient(config.rpcAddress);
  }

  public async balanceOf(address: string): Promise<number> {
    if (!wallet.isAddress(address)) {
      throw new Error("Address is not a valid NEO address");
    }
    try {
      const response = await this.rpcClient.invokeFunction(
        CONST.ASSET_ID.NEO,
        "balanceOf",
        [sc.ContractParam.hash160(address)]
      );
      if (response.state == "FAULT") {
        throw Error;
      }
      return parseInt(response.stack[0].value as string);
    } catch (e) {
      throw new Error(`Failed to get balance of address. Error: ${e}`);
    }
  }

  public async decimals(): Promise<number> {
    if (this._decimals) return this._decimals;
    try {
      const response = await this.rpcClient.invokeFunction(
        this.contractHash.toString(),
        "decimals"
      );
      if (response.state === "FAULT") {
        throw Error;
      }
      this._decimals = parseInt(response.stack[0].value as string);
      return this._decimals;
    } catch (e) {
      throw new Error(
        `Failed to get decimals for contract: ${this.contractHash.toString()}. Error: ${e}`
      );
    }
  }

  public async name(): Promise<string> {
    if (this._name) return this._name;
    try {
      const response = await this.rpcClient.invokeFunction(
        this.contractHash.toString(),
        "decimals"
      );
      if (response.state === "FAULT") {
        throw Error;
      }
      this._name = response.stack[0].value as string;
      return this._name;
    } catch (e) {
      throw new Error(
        `Failed to get name for contract: ${this.contractHash.toString()}. Error: ${e}`
      );
    }
  }

  public async symbol(): Promise<string> {
    if (this._symbol) return this._symbol;
    try {
      const response = await this.rpcClient.invokeFunction(
        this.contractHash.toString(),
        "symbol"
      );
      if (response.state === "FAULT") {
        throw Error;
      }
      this._symbol = response.stack[0].value as string;
      return this._symbol;
    } catch (e) {
      throw new Error(
        `Failed to get symbol for contract: ${this.contractHash.toString()}. Error: ${e}`
      );
    }
  }

  public async totalSupply(): Promise<number> {
    try {
      const response = await this.rpcClient.invokeFunction(
        this.contractHash.toString(),
        "totalSupply"
      );
      if (response.state === "FAULT") {
        throw Error;
      }
      return parseInt(response.stack[0].value as string);
    } catch (e) {
      throw new Error(
        `Failed to get total supply for contract: ${this.contractHash.toString()}. Error: ${e}`
      );
    }
  }

  public async transfer(
    from: string,
    to: string,
    amount: number
  ): Promise<boolean> {
    if (!wallet.isAddress(from)) {
      throw new Error("From address is not a valid NEO address");
    }
    if (!wallet.isAddress(to)) {
      throw new Error("To address is not a valid NEO address");
    }
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }
    if (
      this.config.account === undefined ||
      this.config.account.address != from
    ) {
      throw new Error(
        "Invalid account or account address does not match 'from' address"
      );
    }
    const balance = await this.balanceOf(from);
    if (balance < amount) {
      throw new Error("Insufficient funds");
    }

    const decimals = await this.decimals();
    const builder = new sc.ScriptBuilder();

    const amount_to_transfer =
      decimals == 0 ? amount : amount * Math.pow(10, decimals);
    builder.emitAppCall(this.contractHash, "transfer", [
      HexString.fromHex(wallet.getScriptHashFromAddress(from)),
      HexString.fromHex(wallet.getScriptHashFromAddress(to)),
      amount_to_transfer,
    ]);
    builder.emit(sc.OpCode.ASSERT);
    const transaction = new tx.Transaction();
    transaction.script = HexString.fromHex(builder.build());

    let blockLifeSpan = tx.Transaction.MAX_TRANSACTION_LIFESPAN;
    if (
      this.config.blocksTillExpiry &&
      !(this.config.blocksTillExpiry > tx.Transaction.MAX_TRANSACTION_LIFESPAN)
    )
      blockLifeSpan = this.config.blocksTillExpiry;
    transaction.validUntilBlock =
      (await this.rpcClient.getBlockCount()) + blockLifeSpan - 1;

    // might be needed for transfering from multi-sig address
    // transaction.addSigner({
    //   account: wallet.getScriptHashFromAddress(from),
    //   scopes: "CalledByEntry",
    // });
    transaction.addSigner({
      account: this.config.account.scriptHash,
      scopes: "CalledByEntry",
    });

    transaction.systemFee = new u.Fixed8(
      await getSystemFee(transaction.script, this.config, transaction.signers)
    );

    transaction.networkFee = new u.Fixed8(
      await calculateNetworkFee(transaction, this.config.account, this.config)
    ).div(100_000_000);

    transaction.sign(this.config.account, this.config.networkMagic);
    try {
      await this.rpcClient.sendRawTransaction(transaction);
      return true;
    } catch (e) {
      return false;
    }
  }
}

export class NEOContract extends Nep5Contract {
  constructor(config: CommonConfig) {
    super(HexString.fromHex(CONST.ASSET_ID.NEO), config);
  }

  public async transfer(
    from: string,
    to: string,
    amount: number
  ): Promise<boolean> {
    if (!Number.isInteger(amount)) {
      throw new Error("Amount must be an integer");
    }
    // remainder of the input checks is done in the super class
    return await super.transfer(from, to, amount);
  }

  /**
   * Claim gas for address
   * @param address
   * @returns boolean on success
   */
  public async claimGas(address: string): Promise<boolean> {
    if (!wallet.isAddress(address)) {
      throw new Error("From address is not a valid NEO address");
    }

    const unclaimed = await this.rpcClient.getUnclaimedGas(address);
    if (unclaimed < 0.5) {
      throw new Error("Minimum claim value is 0.5");
    }

    const balance = await this.balanceOf(address);
    return await this.transfer(address, address, balance);
  }

  public async getUnclaimedGas(address: string): Promise<number> {
    if (!wallet.isAddress(address)) {
      throw new Error("From address is not a valid NEO address");
    }
    return await this.rpcClient.getUnclaimedGas(address);
  }
}

export class GASContract extends Nep5Contract {
  constructor(config: CommonConfig) {
    super(HexString.fromHex(CONST.ASSET_ID.GAS), config);
  }
}
