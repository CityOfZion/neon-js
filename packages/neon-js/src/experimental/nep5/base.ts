import { HexString } from "@cityofzion/neon-core/lib/u";
import { CONST, rpc, wallet, sc, u, tx } from "@cityofzion/neon-core";
import { CommonConfig } from "../";
import { setBlockExpiry, addFees } from "../helpers";
import { enc } from "crypto-js";

function base64decode(input: string): string {
  return enc.Utf8.stringify(enc.Base64.parse(input));
}

export class Nep5Contract {
  /**
   * Base class for communicating with NEP-5 contracts on the block chain.
   */
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

  /**
   * Get the number of tokens owned by NEO address
   */
  public async balanceOf(address: string): Promise<number> {
    if (!wallet.isAddress(address)) {
      throw new Error("Address is not a valid NEO address");
    }
    try {
      const response = await this.rpcClient.invokeFunction(
        this.contractHash.toString(),
        "balanceOf",
        [sc.ContractParam.hash160(address)]
      );
      if (response.state == "FAULT") {
        throw Error;
      }

      const decimals = await this.decimals();
      if (decimals === 0) {
        return parseInt(response.stack[0].value as string);
      } else {
        const divider = Math.pow(10, decimals);
        return parseInt(response.stack[0].value as string) / divider;
      }
    } catch (e) {
      throw new Error(`Failed to get balance of address. Error: ${e}`);
    }
  }

  /**
   * Get the number of decimals the token can have
   */
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

  /**
   * Get the human readable name of the token
   */
  public async name(): Promise<string> {
    if (this._name) return this._name;
    try {
      const response = await this.rpcClient.invokeFunction(
        this.contractHash.toString(),
        "name"
      );
      if (response.state === "FAULT") {
        throw Error;
      }
      this._name = base64decode(response.stack[0].value as string);
      return this._name;
    } catch (e) {
      throw new Error(
        `Failed to get name for contract: ${this.contractHash.toString()}. Error: ${e}`
      );
    }
  }

  /**
   * Get the abbreviated name of the token.
   * Often used to represent the token in exchanges
   */
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

      this._symbol = base64decode(response.stack[0].value as string);
      return this._symbol;
    } catch (e) {
      throw new Error(
        `Failed to get symbol for contract: ${this.contractHash.toString()}. Error: ${e}`
      );
    }
  }

  /**
   * Get the total amount of tokens deployed to the system
   *
   * Note: this is not the same as the total freely available tokens for exchanging.
   * A certain amount might be locked in the contract until a specific release date.
   */
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

  /**
   * Move tokens from one address to another
   * @param from source NEO address
   * @param to destination NEO address
   * @param amount quantity of tokens to send
   */
  public async transfer(
    from: string,
    to: string,
    amount: number
  ): Promise<string> {
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

    await setBlockExpiry(
      transaction,
      this.config,
      this.config.blocksTillExpiry
    );

    // add a sender
    transaction.addSigner({
      account: this.config.account.scriptHash,
      scopes: "CalledByEntry",
    });

    await addFees(transaction, this.config);

    transaction.sign(this.config.account, this.config.networkMagic);
    return await this.rpcClient.sendRawTransaction(transaction);
  }
}

export class NEOContract extends Nep5Contract {
  /**
   * Convenience class initializing a Nep5Contract to the NEO token
   * exposing additional claim functions
   * @param config
   */

  constructor(config: CommonConfig) {
    super(HexString.fromHex(CONST.ASSET_ID.NEO), config);
  }

  /**
   * Move tokens from one address to another
   * @param from source NEO address
   * @param to destination NEO address
   * @param amount quantity of tokens to send
   */
  public async transfer(
    from: string,
    to: string,
    amount: number
  ): Promise<string> {
    if (!Number.isInteger(amount)) {
      throw new Error("Amount must be an integer");
    }
    // remainder of the input checks is done in the super class
    return await super.transfer(from, to, amount);
  }

  /**
   * Claim gas for address
   * @param address
   * @returns txid
   */
  public async claimGas(address: string): Promise<string> {
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

  /**
   * Get the available bonus GAS for address
   * @param address
   */
  public async getUnclaimedGas(address: string): Promise<number> {
    if (!wallet.isAddress(address)) {
      throw new Error("From address is not a valid NEO address");
    }
    return await this.rpcClient.getUnclaimedGas(address);
  }
}

export class GASContract extends Nep5Contract {
  /**
   * Convenience class initializing a Nep5Contract to GAS token
   * @param config
   */
  constructor(config: CommonConfig) {
    super(HexString.fromHex(CONST.ASSET_ID.GAS), config);
  }
}
