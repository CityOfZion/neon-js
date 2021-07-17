import { wallet } from "@cityofzion/neon-core";

export type SigningFunction = (
  txData: string,
  verificationScript: string
) => Promise<string>;

export function signWithAccount(acct: wallet.Account): SigningFunction {
  return async (txData, verificationScript) => {
    const scriptHash =
      wallet.getScriptHashFromVerificationScript(verificationScript);
    if (scriptHash !== acct.scriptHash) {
      throw new Error(
        `Requested signature from ${wallet.getAddressFromScriptHash(
          scriptHash,
          acct.addressVersion
        )} but only have key of ${acct.address}.`
      );
    }
    return wallet.sign(txData, acct.privateKey);
  };
}
