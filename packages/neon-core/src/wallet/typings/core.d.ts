export interface ScryptParams {
  cost: number
  blockSize: number
  parallel: number
}

export function getPublicKeyEncoded(publicKey: string): string
export function getPublicKeyUnencoded(publicKey: string): string
export function getPrivateKeyFromWIF(wif: string): string
export function getWIFFromPrivateKey(privateKey: string): string

/** Calculates the public key from a given private key. */
export function getPublicKeyFromPrivateKey(publicKey: string, encode?: boolean): string

/**
 * VerificationScript serves a very niche purpose.
 * It is attached as part of the signature when signing a transaction.
 * Thus, the name 'scriptHash' instead of 'keyHash' is because we are hashing the verificationScript and not the PublicKey.
 */
export function getVerificationScriptFromPublicKey(publicKey: string): string
export function getScriptHashFromPublicKey(publicKey: string): string
export function getAddressFromScriptHash(scriptHash: string): string
export function getScriptHashFromAddress(address: string): string

/** Generates a signature of the transaction based on given private key. */
export function generateSignature(tx: string, privateKey: string): string

/** Generates a random private key */
export function generatePrivateKey(): string

/** Generates a arrayBuffer filled with random bits. */
export function generateRandomArray(length: number): string
