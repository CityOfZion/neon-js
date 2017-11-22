
export class Account {
  constructor(str: string)

  WIF: string
  privateKey: string
  publicKey: string
  scriptHash: string
  address: string

  getPublicKey(encoded: boolean): string
}

//core
export function getPublicKeyEncoded(publicKey: string): string
export function getPublicKeyUnencoded(publicKey: string): string
export function getPrivateKeyFromWIF(wif: string): string
export function getWIFFromPrivateKey(privateKey: string): string
export function getPublicKeyFromPrivateKey(publicKey: string, encode?: boolean): string
export function getVerificationScriptFromPublicKey(publicKey: string): string
export function getScriptHashFromPublicKey(publicKey: string): string
export function getAddressFromScriptHash(scriptHash: string): string
export function getScriptHashFromAddress(address: string): string
export function generateSignature(tx: string, privateKey: string): string
export function generatePrivateKey(): string
export function generateRandomArray(length: number): string

//nep2
export function encryptWifAccount(wif: string, passphrase: string): Promise<Account>
export function generateEncryptedWif(passphrase: string): Promise<Account>
export function encrypt(wifKey: string, keyphrase: string): string
export function decrypt(encryptedKey: string, keyphrase: string): string
export function encryptWIF(wif: string, passphrase: string): Promise<string>
export function decryptWIF(encrypted: string, passphrase: string): Promise<string>

//verify
export function isNEP2(nep2: string): boolean
export function isWIF(wif: string): boolean
export function isPrivateKey(key: string): boolean
export function isPublicKey(key: string, encoded?: boolean): boolean
export function isAddress(address: string): boolean

export default {
  create: {
    account: (k: string) => Account,
    privateKey: generatePrivateKey,
    signature: generateSignature
  },
  is: {
    address: isAddress,
    publicKey: isPublicKey,
    encryptedKey: isNEP2,
    privateKey: isPrivateKey,
    wif: isWIF
  },
  encrypt: {
    privateKey: encrypt
  },
  decrypt: {
    privateKey: decrypt
  },
  get: {
    privateKeyFromWIF: getPrivateKeyFromWIF,
    WIFFromPrivateKey: getWIFFromPrivateKey,
    publicKeyFromPrivateKey: getPublicKeyFromPrivateKey,
    scriptHashFromPublicKey: getScriptHashFromPublicKey,
    addressFromScriptHash: getAddressFromScriptHash,
    scriptHashFromAddress: getScriptHashFromAddress
  }
}
