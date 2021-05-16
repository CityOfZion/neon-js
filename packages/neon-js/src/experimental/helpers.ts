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
    else if (sc.isSignatureContract(witnessScript)) {
      networkFeeSize += 67 + u.getSerializedSize(witnessScript);
      networkFee =
        execFeeFactor *
        (sc.OpCodePrices[sc.OpCode.PUSHDATA1] * 2 +
          sc.OpCodePrices[sc.OpCode.SYSCALL] +
          sc.getInteropServicePrice(
            sc.InteropServiceCode.SYSTEM_CRYPTO_CHECKSIG
          ));
    } else if (sc.isMultisigContract(witnessScript)) {
      const publicKeyCount = wallet.getPublicKeysFromVerificationScript(
        witnessScript.toString()
      ).length;
      const signatureCount = wallet.getSigningThresholdFromVerificationScript(
        witnessScript.toString()
      );
      const invocationScriptSize = 66 * signatureCount;
      networkFeeSize +=
        u.getSerializedSize(invocationScriptSize) +
        invocationScriptSize +
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
        (sc.getInteropServicePrice(
          sc.InteropServiceCode.SYSTEM_CRYPTO_CHECKMULTISIG
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
      throw Error(
        `Script execution failed. ExecutionEngine state = FAULT. ${response.exception}`
      );
    }
    return u.BigInteger.fromDecimal(response.gasconsumed, 0);
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
  if (config.systemFeeOverride) {
    transaction.systemFee = config.systemFeeOverride;
  } else {
    transaction.systemFee = await getSystemFee(
      transaction.script,
      config,
      transaction.signers
    );
  }

  if (config.account === undefined)
    throw new Error(
      "Cannot determine network fee and validate balances without an account in your config"
    );

  if (config.networkFeeOverride) {
    transaction.networkFee = config.networkFeeOverride;
  } else {
    transaction.networkFee = await calculateNetworkFee(
      transaction,
      config.account,
      config
    );
  }

  const GAS = new GASContract(config);
  const gasBalance = await GAS.balanceOf(config.account.address);
  const requiredGAS = parseFloat(
    transaction.systemFee.add(transaction.networkFee).toDecimal(8)
  );
  if (gasBalance < requiredGAS) {
    throw new Error(
      `Insufficient GAS. Required: ${requiredGAS} Available: ${gasBalance}`
    );
  }
}

/**
 * Deploy a smart contract
 * @param nef - A smart contract in Neo executable file format. Commonly created by a NEO compiler and stored as .NEF on disk
 * @param manifest - the manifest corresponding to the smart contract
 * @param config -
 */
export async function deployContract(
  nef: sc.NEF,
  manifest: sc.ContractManifest,
  config: CommonConfig
): Promise<string> {
  const builder = new sc.ScriptBuilder();
  builder.emitContractCall({
    scriptHash: CONST.NATIVE_CONTRACT_HASH.ManagementContract,
    operation: "deploy",
    callFlags: sc.CallFlags.All,
    args: [
      sc.ContractParam.byteArray(u.HexString.fromHex(nef.serialize(), true)),
      sc.ContractParam.string(JSON.stringify(manifest.toJson())),
    ],
  });

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

/**
 * Get the hash that identifies the contract on the chain matching the specified NEF
 * @param sender - The sender of the transaction
 * @param nefChecksum - The checksum of the Neo Executable File. A NEF file is a smart contract commonly created by a NEO compiler and stored as .NEF on disk
 * @param contractName - The name as indicated in the manifest
 */
export function getContractHash(
  sender: u.HexString,
  nefChecksum: number,
  contractName: string
): string {
  const assembledScript = new sc.ScriptBuilder()
    .emit(sc.OpCode.ABORT)
    .emitPush(sender)
    .emitPush(nefChecksum)
    .emitPush(contractName)
    .build();
  return u.reverseHex(u.hash160(assembledScript));
}
