import { tx, wallet, u } from "@cityofzion/neon-core";

export function checkMultisigAcc(
  transaction: tx.Transaction,
  multisigAcc: wallet.Account
) {
  if (!multisigAcc.isMultiSig) {
    throw new Error(`${multisigAcc} is not a multi-sig account`);
  }

  if (
    ![
      transaction.sender,
      ...transaction.cosigners.map(cosigner => cosigner.account)
    ].some(scriptHash => u.reverseHex(scriptHash) === multisigAcc.scriptHash)
  ) {
    throw new Error(
      `${multisigAcc} is neither sender nor cosigner in this transaction ${transaction}`
    );
  }
}
