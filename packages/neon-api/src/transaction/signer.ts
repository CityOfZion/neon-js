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
   * Sign a transaction with Accounts or Private Keys
   * @description This is used when you have full access to signer accounts
   * @param accounts accounts that will sign this transaction
   */
  public signWithAccount(...accounts: (wallet.Account | string)[]) {
    accounts.forEach(account => {
      this._checkAcc(account);
      this.transaction.sign(account);
    });
  }

  /**
   * Sign a transaction with Witnesses
   * @description This can be used when you accept a signature from someone else
   * @param witnesses witnesses that will be added to the transaction
   */
  public signWithWitness(...witnesses: tx.Witness[]) {
    witnesses.forEach(witness => {
      this._checkWitness(witness);
      this.transaction.addWitness(witness);
    });
  }

  /**
   * Sign a transaction with multi-signatures for multi-sig account
   * @param multisigAccount multisig account
   * @param witnesses signatures from accounts within the multisig-account
   */
  public addMultiSig(
    multisigAccount: wallet.Account,
    ...witnesses: tx.Witness[]
  ) {
    this._checkMultisigAcc(multisigAccount);
    const multisigWitness = tx.Witness.buildMultiSig(
      this.transaction.serialize(),
      witnesses,
      multisigAccount
    );
    this.transaction.addWitness(multisigWitness);
  }

  private _checkAcc(account: wallet.Account | string) {
    const acc = new wallet.Account(account);
    this._checkScripthash(acc.scriptHash);
  }

  private _checkWitness(witness: tx.Witness) {
    const publicKeys = wallet.getPublicKeysFromVerificationScript(
      witness.verificationScript
    );
    if (publicKeys.length > 1) {
      const threshold = wallet.getSigningThresholdFromVerificationScript(
        witness.verificationScript
      );
      this._checkScripthash(
        wallet.Account.createMultiSig(threshold, publicKeys).scriptHash
      );
    } else if (publicKeys.length === 1) {
      this._checkScripthash(wallet.getScriptHashFromPublicKey(publicKeys[0]));
    } else {
      throw new Error("Invalid witness: Invalid verification script.");
    }
  }

  private _checkMultisigAcc(multisigAcc: wallet.Account) {
    if (!multisigAcc.isMultiSig) {
      throw new Error(`${multisigAcc} is not a multi-sig account`);
    }

    this._checkScripthash(multisigAcc.scriptHash);
  }

  private _getSignerHashes() {
    return [
      this.transaction.sender,
      ...this.transaction.cosigners.map(cosigner => cosigner.account)
    ].map(hash => u.reverseHex(hash));
  }

  private _checkScripthash(scriptHash: string) {
    if (!this._getSignerHashes().some(hash => hash === scriptHash)) {
      throw new Error(
        `account with scripthash: ${scriptHash} is neither sender nor cosigner`
      );
    }
  }
}
