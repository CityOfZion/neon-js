
/** Converts signatureHex to a signature object with r & s. */
export function getSignatureFromHex(signatureHex: string): {}

/** Generates a signature of the message based on given private key. */
export function signMessage (message: string, privateKey: string): string

/** Verifies signature matches message and is valid for given public key. */
export function verifyMessage (message: string, signature: string, publicKey: string): boolean
