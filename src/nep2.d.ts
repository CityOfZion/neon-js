declare module 'neon-js' {
  type AccountWithEncryptedWif = {
    address: string
    encryptedWif: string
    passphrase: string
    wif: string
  }

  function encryptWifAccount(
    wif: string,
    passphrase: string
  ): Promise<AccountWithEncryptedWif>

  function generateEncryptedWif(
    passphrase: string
  ): Promise<AccountWithEncryptedWif>

  function encryptWIF(wif: string, passphrase: string): Promise<string>

  function decryptWIF(encrypted: string, passphrase: string): Promise<string>
}
