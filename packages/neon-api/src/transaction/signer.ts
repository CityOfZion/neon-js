import { tx, wallet, u } from "@cityofzion/neon-core";

/**
 * A class with functions to sign transaction
 */
export class TransactionSigner {
  /**
   * transaction to be signed
   */
  public transaction: tx.Transaction;

  constructor(transaction: tx.Transaction) {
    this.transaction = transaction;
  }

  /**
   * Sign a transaction with Accounts or Private Keys.
   * This is used when you have full access to signer accounts
   * @param accounts - accounts that will sign this transaction
   */
  public signWithAccount(...accounts: (wallet.Account | string)[]): void {
    accounts.forEach((account) => {
      this._checkAcc(account);
      this.transaction.sign(account);
    });
  }

  /**
   * Sign a transaction with Witnesses.
   * This can be used when you accept a signature from someone else
   * @param witnesses - witnesses that will be added to the transaction
   */
  public signWithWitness(...witnesses: tx.Witness[]): void {
    witnesses.forEach((witness) => {
      this._checkWitness(witness);
      this.transaction.addWitness(witness);
    });
  }

  /**
   * Sign a transaction with multi-signatures for multi-sig account
   * @param multisigAccount - multisig account
   * @param witnesses - signatures from accounts within the multisig-account
   */
  public signWithMultiSigAccount(
    multisigAccount: wallet.Account,
    ...witnesses: tx.Witness[]
  ): void {
    this._checkMultisigAcc(multisigAccount);
    const multisigWitness = tx.Witness.buildMultiSig(
      this.transaction.serialize(),
      witnesses,
      multisigAccount
    );
    this.transaction.addWitness(multisigWitness);
  }

  private _checkAcc(account: wallet.Account | string): void {
    const acc = new wallet.Account(account);
    this._assertShouldSign(acc.scriptHash);
  }

  private _checkWitness(witness: tx.Witness): void {
    this._assertShouldSign(
      u.reverseHex(u.hash160(witness.verificationScript.toBigEndian()))
    );
  }

  private _checkMultisigAcc(multisigAcc: wallet.Account): void {
    if (!multisigAcc.isMultiSig) {
      throw new Error(
        `${multisigAcc} is not a multi-sig account or cannot get verificationScript from it`
      );
    }

    this._assertShouldSign(multisigAcc.scriptHash);
  }

  private _getSignerHashes(): Array<string> {
    return [
      this.transaction.sender,
      ...this.transaction.cosigners.map((cosigner) => cosigner.account),
    ].map((hash) => u.reverseHex(hash.toBigEndian()));
  }

  private _assertShouldSign(scriptHash: string): void {
    if (!this._getSignerHashes().some((hash) => hash === scriptHash)) {
      throw new Error(
        `account with scripthash: ${scriptHash} is neither sender nor cosigner`
      );
    }
  }
}
