import { CONST, rpc, sc, tx, u, wallet } from "@cityofzion/neon-core";
import { CommonConfig } from "./types";
import { GASContract } from "./nep17";

/**
 * Calculate the GAS costs for validation and inclusion of the transaction in a block
 * @param transaction - the transaction to calculate the network fee for
 * @param account -
 * @param config -
 */
export async function calculateNetworkFee(
  transaction: tx.Transaction,
  account: wallet.Account,
  config: CommonConfig
): Promise<u.BigInteger> {
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

  const rpcClient = new rpc.RPCClient(config.rpcAddress);

  let execFeeFactor = 0;
  try {
    const response = await rpcClient.invokeFunction(
      CONST.NATIVE_CONTRACT_HASH.PolicyContract,
      "getExecFeeFactor"
    );
    if (response.state === "FAULT") {
      throw Error;
    }
    execFeeFactor = parseInt(response.stack[0].value as string);
  } catch (e) {
    throw new Error(
      `Failed to get 'Execution Fee factor' from Policy contract. Error: ${e}`
    );
  }

  let networkFee = 0;
  hashes.map((hash) => {
    let witnessScript;
    if (hash === account.scriptHash && account.contract.script !== undefined) {
      witnessScript = u.HexString.fromBase64(account.contract.script);
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
        execFeeFactor *
        (sc.OpCodePrices[sc.OpCode.PUSHDATA1] +
          sc.OpCodePrices[sc.OpCode.PUSHDATA1] +
          sc.OpCodePrices[sc.OpCode.PUSHNULL] +
          sc.getInteropServicePrice(
            sc.InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256R1
          ));
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
      networkFee +=
        execFeeFactor * sc.OpCodePrices[sc.OpCode.PUSHDATA1] * signatureCount;

      const builder = new sc.ScriptBuilder();
      let pushOpcode = sc.fromHex(
        builder.emitPush(signatureCount).build().slice(0, 2)
      );
      // price for pushing the signature count
      networkFee += execFeeFactor * sc.OpCodePrices[pushOpcode];

      // now do the same for the public keys
      builder.reset();
      pushOpcode = sc.fromHex(
        builder.emitPush(publicKeyCount).build().slice(0, 2)
      );
      // price for pushing the public key count
      networkFee += execFeeFactor * sc.OpCodePrices[pushOpcode];
      networkFee +=
        execFeeFactor *
        (sc.OpCodePrices[sc.OpCode.PUSHNULL] +
          sc.getInteropServicePrice(
            sc.InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256R1
          ) *
            publicKeyCount);
    }
    // else { // future supported contract types}
  });

  try {
    const response = await rpcClient.invokeFunction(
      CONST.NATIVE_CONTRACT_HASH.PolicyContract,
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

  return u.BigInteger.fromDecimal(networkFee, 0);
}

/**
 * Get the cost of executing the smart contract script
 * @param script - smart contract script
 * @param config -
 * @param signers - signers to set while running the script
 */
export async function getSystemFee(
  script: u.HexString,
  config: CommonConfig,
  signers?: tx.Signer[]
): Promise<u.BigInteger> {
  const rpcClient = new rpc.RPCClient(config.rpcAddress);
  try {
    const response = await rpcClient.invokeScript(script, signers);
    if (response.state === "FAULT") {
      throw Error("Script execution failed. ExecutionEngine state = FAULT");
    }
    return u.BigInteger.fromDecimal(response.gasconsumed, 8);
  } catch (e) {
    throw new Error(`Failed to get system fee. ${e}`);
  }
}

/**
 * Set the validUntilBlock field on a transaction
 *
 * If `blocksTillExpiry` is provided then the value is used.
 * If `blocksTillExpiry` is not provided, or the value exceeds the maximum allowed,
 * then the field is automatically set to the maximum allowed by the network.
 * @param transaction - the transaction to set the expiry field on
 * @param config -
 * @param blocksTillExpiry - number of blocks from the current chain height until the transaction is no longer valid
 */
export async function setBlockExpiry(
  transaction: tx.Transaction,
  config: CommonConfig,
  blocksTillExpiry?: number
): Promise<void> {
  let blockLifeSpan = tx.Transaction.MAX_TRANSACTION_LIFESPAN;
  if (
    blocksTillExpiry &&
    !(blocksTillExpiry > tx.Transaction.MAX_TRANSACTION_LIFESPAN)
  )
    blockLifeSpan = blocksTillExpiry;
  const rpcClient = new rpc.RPCClient(config.rpcAddress);
  transaction.validUntilBlock =
    (await rpcClient.getBlockCount()) + blockLifeSpan - 1;
}

/**
 * Add system and network fees to a transaction.
 * Validates that the source Account has sufficient balance
 * @param transaction - the transaction to add network and system fees to
 * @param config -
 * @param token_decimals -
 */
export async function addFees(
  transaction: tx.Transaction,
  config: CommonConfig
): Promise<void> {
  transaction.systemFee = await getSystemFee(
    transaction.script,
    config,
    transaction.signers
  );

  if (config.account === undefined)
    throw new Error(
      "Cannot determine network fee and validate balances without an account in your config"
    );

  transaction.networkFee = await calculateNetworkFee(
    transaction,
    config.account,
    config
  );

  const GAS = new GASContract(config);
  const GASBalance = await GAS.balanceOf(config.account.address);
  const requiredGAS = parseFloat(
    transaction.systemFee.add(transaction.networkFee).toDecimal(8)
  );
  if (GASBalance < requiredGAS) {
    throw new Error(
      `Insufficient GAS. Required: ${requiredGAS} Available: ${GASBalance}`
    );
  }
}

/**
 * Deploy a smart contract
 * @param NEF - A smart contract in Neo executable file format. Commonly created by a NEO compiler and stored as .NEF on disk
 * @param manifest - the manifest conresponding to the smart contract
 * @param config -
 */
export async function deployContract(
  NEF: Buffer | ArrayBuffer,
  manifest: sc.ContractManifest,
  config: CommonConfig
): Promise<string> {
  if (typeof NEF === "object" && NEF instanceof ArrayBuffer) {
    NEF = Buffer.from(NEF);
  }
  const builder = new sc.ScriptBuilder();
  builder.emitAppCall(CONST.NATIVE_CONTRACT_HASH.ManagementContract, "deploy", [
    u.HexString.fromHex(u.reverseHex(NEF.toString("hex"))),
    JSON.stringify(manifest.toJson()),
  ]);

  const transaction = new tx.Transaction();
  transaction.script = u.HexString.fromHex(builder.build());

  await setBlockExpiry(transaction, config, config.blocksTillExpiry);

  // add a sender
  if (config.account === undefined)
    throw new Error("Account in your config cannot be undefined");

  transaction.addSigner({
    account: config.account.scriptHash,
    scopes: "CalledByEntry",
  });

  await addFees(transaction, config);

  transaction.sign(config.account, config.networkMagic);
  const rpcClient = new rpc.RPCClient(config.rpcAddress);
  return await rpcClient.sendRawTransaction(transaction);
}

export function getContractHash(sender: u.HexString, nef: Buffer): string {
  const SCRIPT_OFFSET = 68; //   4 magic + 32 compiler + 32 version
  const stream = new u.StringStream(nef.slice(SCRIPT_OFFSET).toString("hex"));
  const script = stream.readVarBytes();
  const script_buf = Buffer.from(script, "hex");
  script_buf.reverse();
  const builder = new sc.ScriptBuilder();
  builder.emit(sc.OpCode.ABORT);
  builder.emitPush(sender);
  builder.emitPush(u.HexString.fromHex(script_buf.toString("hex")));
  return u.reverseHex(u.hash160(builder.build()));
}
