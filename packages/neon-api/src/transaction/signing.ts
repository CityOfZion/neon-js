import { wallet, tx } from "@cityofzion/neon-core";

export type SigningFunction = (
  tx: tx.Transaction,
  details: {
    network: number;
    witnessIndex: number;
  },
) => Promise<string>;

export function signWithAccount(acct: wallet.Account): SigningFunction {
  return async (tx, details) => {
    const txData = tx.getMessageForSigning(details.network);
    const scriptHash = wallet.getScriptHashFromVerificationScript(
      tx.witnesses[details.witnessIndex].verificationScript.toString(),
    );
    if (scriptHash !== acct.scriptHash) {
      throw new Error(
        `Requested signature from ${wallet.getAddressFromScriptHash(
          scriptHash,
          acct.addressVersion,
        )} but only have key of ${acct.address}.`,
      );
    }
    return wallet.sign(txData, acct.privateKey);
  };
}
