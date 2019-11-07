import { tx, rpc, u } from "@cityofzion/neon-core";
import { getNetworkFee, getScriptHashesFromTxWitnesses } from "./util";

export class TransactionValidator {
  public rpcClient: rpc.RPCClient;

  constructor(rpc: rpc.RPCClient) {
    this.rpcClient = rpc;
  }

  validateValidUntilBlock = async (
    transaction: tx.Transaction,
    autoFix = false
  ): Promise<tx.Transaction> => {
    const { validUntilBlock } = transaction;
    const height = await this.rpcClient.getBlockCount();
    if (
      validUntilBlock <= height ||
      validUntilBlock >= height + tx.Transaction.MAX_TRANSACTION_LIFESPAN
    ) {
      const vub_suggestion =
        tx.Transaction.MAX_TRANSACTION_LIFESPAN + height - 1;
      if (autoFix) {
        transaction.validUntilBlock = vub_suggestion;
        return transaction;
      }
      return Promise.reject({
        validaUntilBlock: vub_suggestion
      });
    }
    return transaction;
  };

  validateIntents = async (
    transaction: tx.Transaction
  ): Promise<tx.Transaction> => {
    return transaction;
  };

  /**
   * Will also fix when systemFee is greater
   * even if script execution will fail, the transaction will be valid, shall we report error when 'FAULT'?
   * @param transaction
   * @param autoFix
   */

  validateSystemFee = async (
    transaction: tx.Transaction,
    autoFix = false
  ): Promise<tx.Transaction> => {
    const { script, systemFee } = transaction;
    const { gas_consumed } = await this.rpcClient.invokeScript(script);
    const requiredSystemFee = new u.Fixed8(parseFloat(gas_consumed)).ceil();
    if (autoFix && !requiredSystemFee.equals(systemFee)) {
      transaction.systemFee = systemFee;
    } else if (requiredSystemFee.isGreaterThan(systemFee)) {
      return Promise.reject({
        systemFee: requiredSystemFee
      });
    }
    return transaction;
  };

  /**
   * Will also fix when systemFee is greater
   * @param transaction
   * @param autoFix
   */
  validateNetworkFee = async (
    transaction: tx.Transaction,
    autoFix = false
  ): Promise<tx.Transaction> => {
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
  };

  validateSigning = async (
    transaction: tx.Transaction
  ): Promise<tx.Transaction> => {
    const scriptHashes: string[] = getScriptHashesFromTxWitnesses(transaction);
    const signers = transaction
      .getScriptHashesForVerifying()
      .map(hash => u.reverseHex(hash));
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
  };
}
