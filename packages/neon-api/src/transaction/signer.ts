import { tx, wallet } from "@cityofzion/neon-core";
import { checkMultisigAcc } from "./util";

/**
 * A class with static functions to sign transaction
 */
export class TransactionSigner {
  /**
   * Sign a transaction with Accounts or Private Keys
   * @description This is used when you have full access to signer accounts
   * @param transaction transaction to be signed
   * @param accounts accounts that will sign this transaction
   */
  public static signWithAccount(
    transaction: tx.Transaction,
    ...accounts: (wallet.Account | string)[]
  ) {
    accounts.forEach(account => transaction.sign(account));
  }

  /**
   * Sign a transaction with Witnesses
   * @description This can be used when you accept a signature from someone else
   * @param transaction transaction to be signed
   * @param witnesses witnesses that will be added to the transaction
   */
  public static signWithWitness(
    transaction: tx.Transaction,
    ...witnesses: tx.Witness[]
  ) {
    witnesses.forEach(witness => transaction.addWitness(witness));
  }

  /**
   * Sign a transaction with multi-signatures for multi-sig account
   * @param transaction transaction to be signed
   * @param multisigAccount multisig account
   * @param witnesses signatures from accounts within the multisig-account
   */
  public static addMultiSig(
    transaction: tx.Transaction,
    multisigAccount: wallet.Account,
    ...witnesses: tx.Witness[]
  ) {
    checkMultisigAcc(transaction, multisigAccount);
    const multisigWitness = tx.Witness.buildMultiSig(
      transaction.serialize(),
      witnesses,
      multisigAccount
    );
    transaction.addWitness(multisigWitness);
  }
}
