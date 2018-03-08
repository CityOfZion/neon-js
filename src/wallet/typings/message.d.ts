
/** Generates a signature of the message based on given private key. */
export function signMessage (message: string, privateKey: string): string

/** Verifies signature matches message and is valid for given public key. */
export function verifyMessage (message: string, signature: string, publicKey: string): boolean
