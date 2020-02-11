import Account from "./Account";
import { decryptNeo2 } from "./nep2";
import { DEFAULT_SCRYPT } from "../consts";

/**
 * Upgrades a Neo2 account to a Neo3 account. If an encrypted account is provided, the returned account is also encrypted with the same passphrase.
 */
export async function upgrade(
  account: Account,
  passphrase = "",
  scryptParams = DEFAULT_SCRYPT
): Promise<Account> {
  // Checks that account is upgradable
  if (!account.tryGet("privateKey") && passphrase === "") {
    throw new Error(`The account needs an unencrypted private key.`);
  }
  // Check if address is neo2 style (Starts with A)
  if (!account.address.startsWith("A")) {
    throw new Error(`This is not a neo2 Address.`);
  }

  if (passphrase) {
    const wifKey = await decryptNeo2(
      account.encrypted,
      passphrase,
      scryptParams
    );
    const neo3Account = new Account(wifKey);
    return await neo3Account.encrypt(passphrase, scryptParams);
  }

  const wifKey = account.WIF;
  const neo3Account = new Account(wifKey);
  return neo3Account;
}
