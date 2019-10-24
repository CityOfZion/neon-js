import { Transaction } from "@cityofzion/neon-core/lib/tx";
import { RPCClient } from "@cityofzion/neon-core/lib/rpc";
import { Fixed8, reverseHex } from "@cityofzion/neon-core/lib/u";
import { getNetworkFee, getScriptHashesFromTxWitnesses } from "./util";

export async function validateValidUntilBlock(
  transaction: Transaction,
  rpc: RPCClient,
  autoFix = false
): Promise<Transaction> {
  const { validUntilBlock } = transaction;
  const height = await rpc.getBlockCount();
  if (
    validUntilBlock <= height ||
    validUntilBlock >= height + Transaction.MAX_TRANSACTION_LIFESPAN
  ) {
    const vub_suggestion = Transaction.MAX_TRANSACTION_LIFESPAN + height - 1;
    if (autoFix) {
      transaction.validUntilBlock = vub_suggestion;
      return transaction;
    }
    return Promise.reject({
      validaUntilBlock: vub_suggestion
    });
  }
  return transaction;
}

export async function validateIntents(
  transaction: Transaction,
  rpc: RPCClient
): Promise<Transaction> {
  return transaction;
}

/**
 * Will also fix when systemFee is greater
 * even if script execution will fail, the transaction will be valid, shall we report error when 'FAULT'?
 * @param transaction
 * @param rpc
 * @param autoFix
 */

export async function validateSystemFee(
  transaction: Transaction,
  rpc: RPCClient,
  autoFix = false
): Promise<Transaction> {
  const { script, systemFee } = transaction;
  const { gas_consumed } = await rpc.invokeScript(script);
  const requiredSystemFee = new Fixed8(parseFloat(gas_consumed)).ceil();
  if (autoFix && !requiredSystemFee.equals(systemFee)) {
    transaction.systemFee = systemFee;
  } else if (requiredSystemFee.isGreaterThan(systemFee)) {
    return Promise.reject({
      systemFee: requiredSystemFee
    });
  }
  return transaction;
}

/**
 * Will also fix when systemFee is greater
 * @param transaction
 * @param rpc
 * @param autoFix
 */
export async function validateNetworkFee(
  transaction: Transaction,
  rpc: RPCClient,
  autoFix = false
): Promise<Transaction> {
  const { networkFee } = transaction;
  const requiredNetworkFee = getNetworkFee(transaction);
  if (autoFix && !requiredNetworkFee.equals(networkFee)) {
    transaction.networkFee = requiredNetworkFee;
  } else if (requiredNetworkFee.isGreaterThan(networkFee)) {
    return Promise.reject({
      networkFee: requiredNetworkFee
    });
  }
  return transaction;
}

export async function validateSigning(
  transaction: Transaction
): Promise<Transaction> {
  const scriptHashes: string[] = getScriptHashesFromTxWitnesses(transaction);
  const signers = transaction
    .getScriptHashesForVerifying()
    .map(hash => reverseHex(hash));
  let notSigned = "";
  if (
    signers.every(signer => {
      if (scriptHashes.indexOf(signer) < 0) {
        notSigned = signer;
        return false;
      }
      return true;
    })
  ) {
    return transaction;
  }
  return Promise.reject({
    witnesses: notSigned
  });
}
