/**
 * Encodes a public key.
 * @param unencodedKey unencoded public key
 * @return encoded public key
 */
export declare function getPublicKeyEncoded(unencodedKey: string): string;
/**
 * Unencodes a public key.
 * @param  publicKey Encoded public key
 * @return decoded public key
 */
export declare function getPublicKeyUnencoded(publicKey: string): string;
/**
 * Converts a WIF to private key.
 */
export declare function getPrivateKeyFromWIF(wif: string): string;
/**
 * Converts a private key to WIF.
 */
export declare function getWIFFromPrivateKey(privateKey: string): string;
/**
 * Converts a private key to public key.
 * @param privateKey
 * @param encode Returns the encoded form if true.
 */
export declare function getPublicKeyFromPrivateKey(privateKey: string, encode?: boolean): string;
/**
 * Converts a public key to verification script form.
 * VerificationScript serves a very niche purpose.
 * It is attached as part of the signature when signing a transaction.
 * Thus, the name 'scriptHash' instead of 'keyHash' is because we are hashing the verificationScript and not the PublicKey.
 */
export declare const getVerificationScriptFromPublicKey: (publicKey: string) => string;
/**
 * Converts a public key to scripthash.
 */
export declare const getScriptHashFromPublicKey: (publicKey: string) => string;
/**
 * Converts a scripthash to address.
 */
export declare const getAddressFromScriptHash: (scriptHash: string) => string;
/**
 * Converts an address to scripthash.
 */
export declare const getScriptHashFromAddress: (address: string) => string;
/**
 * Generates a signature of the transaction based on given private key.
 * @param tx Serialized unsigned transaction.
 * @param privateKey Private Key.
 * @return Signature. Does not include tx.
 */
export declare const generateSignature: (tx: string, privateKey: string) => string;
/**
 * Generates a random private key.
 */
export declare const generatePrivateKey: () => string;
//# sourceMappingURL=core.d.ts.map