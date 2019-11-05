import { Transaction } from "@cityofzion/neon-core/lib/tx";
import { RPCClient } from "@cityofzion/neon-core/lib/rpc";
import { Fixed8, reverseHex } from "@cityofzion/neon-core/lib/u";
import { getNetworkFee, getScriptHashesFromTxWitnesses } from "./util";

export class TransactionValidator {
  public rpcClient: RPCClient;

  constructor(rpc: RPCClient) {
    this.rpcClient = rpc;
  }

  validateValidUntilBlock = async (
    transaction: Transaction,
    autoFix = false
  ): Promise<Transaction> => {
    const { validUntilBlock } = transaction;
    const height = await this.rpcClient.getBlockCount();
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
  };

  validateIntents = async (transaction: Transaction): Promise<Transaction> => {
    return transaction;
  };

  /**
   * Will also fix when systemFee is greater
   * even if script execution will fail, the transaction will be valid, shall we report error when 'FAULT'?
   * @param transaction
   * @param autoFix
   */

  validateSystemFee = async (
    transaction: Transaction,
    autoFix = false
  ): Promise<Transaction> => {
    const { script, systemFee } = transaction;
    const { gas_consumed } = await this.rpcClient.invokeScript(script);
    const requiredSystemFee = new Fixed8(parseFloat(gas_consumed)).ceil();
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
    transaction: Transaction,
    autoFix = false
  ): Promise<Transaction> => {
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

  validateSigning = async (transaction: Transaction): Promise<Transaction> => {
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
  };
}
