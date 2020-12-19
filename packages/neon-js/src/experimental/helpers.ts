import { CONST, rpc, sc, tx, u, wallet } from "@cityofzion/neon-core";
import { CommonConfig } from "./types";
import { GASContract } from "./nep5";

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
      // price for pushing the signature count
      networkFee += sc.OpCodePrices[pushOpcode];

      // now do the same for the public keys
      builder.reset();
      pushOpcode = sc.fromHex(
        builder.emitPush(publicKeyCount).build().slice(0, 2)
      );
      // price for pushing the public key count
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
): Promise<number> {
  const rpcClient = new rpc.RPCClient(config.rpcAddress);
  try {
    const response = await rpcClient.invokeScript(script.toString(), signers);
    if (response.state === "FAULT") {
      throw Error("Script execution failed. ExecutionEngine state = FAULT");
    }
    return parseFloat(
      u.BigInteger.fromNumber(response.gasconsumed).toDecimal(8)
    );
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
 */
export async function addFees(
  transaction: tx.Transaction,
  config: CommonConfig
): Promise<void> {
  transaction.systemFee = u.BigInteger.fromDecimal(
    await getSystemFee(transaction.script, config, transaction.signers),
    8
  );

  if (config.account === undefined)
    throw new Error(
      "Cannot determine network fee and validate balances without an account in your config"
    );

  transaction.networkFee = u.BigInteger.fromDecimal(
    await calculateNetworkFee(transaction, config.account, config),
    8
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
