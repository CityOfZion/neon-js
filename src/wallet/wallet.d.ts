declare module 'neon-js' {
  type Account = {
    address: string
    privateKey: string
    programHash: string
    publicKeyEncoded: string
    publicKeyHash: string
  }

  function addressToScriptHash(address: string): string

  function addContract(
    txData: string,
    sign: string,
    publicKeyEncoded: string
  ): string

  function createSignatureScript(publicKeyEncoded: string | ArrayBuffer): string

  function getWIFFromPrivateKey(privateKey: ArrayBuffer): string

  function generatePrivateKey(): ArrayBuffer

  function generateRandomArray(bytesLength: number): ArrayBuffer

  function getAccountFromPrivateKey(privateKey: string): Account

  function getAccountFromPublicKey(
    publicKeyEncoded: string,
    privateKey: string
  ): Account | -1

  function getAccountFromWIFKey(wifKey: string): Account | -1 | -2

  function getHash(signatureScript: string): string

  function getPrivateKeyFromWIF(wif: string): string

  function getPublicKey(privateKey: string, encode: boolean): ArrayBuffer

  function getPublicKeyEncoded(publicKey: string): string

  function toAddress(programHash: ArrayBuffer): string

  function getScriptHashFromAddress(address: string): string

  function getScriptHashFromPublicKey(publicKey: string): string

  function signatureData(data: string, privateKey: string): string

  function verifyAddress(address: string): boolean

  function verifyPublicKeyEncoded(publicKeyEncoded: string): boolean
}
