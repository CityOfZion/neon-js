export interface ScryptParams {
  cost: number
  blockSize: number
  parallel: number
}

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
