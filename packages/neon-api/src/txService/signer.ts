import { tx, wallet } from "@cityofzion/neon-core";
import { checkMultisigAcc } from "./util";

export class TransactionSigner {
  public static signWithAccount(
    transaction: tx.Transaction,
    ...accounts: (wallet.Account | string)[]
  ) {
    accounts.forEach(account => transaction.sign(account));
  }

  public static signWithWitness(
    transaction: tx.Transaction,
    ...witnesses: tx.Witness[]
  ) {
    witnesses.forEach(witness => transaction.addWitness(witness));
  }

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
