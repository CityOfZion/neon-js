/**
 * Verification methods on the various key formats.
 * Useful for identification and ensuring key is valid.
 *
 * Methods are named as is<Format> where:
 * <Format> is the key format to check.
 *
 * All methods take in Big-Endian strings and return boolean.
 */
/**
 * Verifies a NEP2. This merely verifies the format. It is unable to verify if it is has been tampered with.
 */
export declare function isNEP2(nep2: string): boolean;
/**
 * Verifies a WIF using its checksum.
 */
export declare function isWIF(wif: string): boolean;
/**
 * Checks if hexstring is a valid Private Key. Any hexstring of 64 chars is a valid private key.
 */
export declare function isPrivateKey(key: string): boolean;
/**
 * Checks if hexstring is a valid Public Key. Accepts both encoded and unencoded forms.
 * @param key
 * @param  encoded Optional parameter to specify for a specific form. If this is omitted, this function will return true for both forms. If this parameter is provided, this function will only return true for the specific form.
 */
export declare function isPublicKey(key: string, encoded?: boolean): boolean;
/**
 * Verifies if string is a scripthash.
 */
export declare function isScriptHash(scriptHash: string): boolean;
/**
 * Verifies an address using its checksum.
 */
export declare function isAddress(address: string): boolean;
//# sourceMappingURL=verify.d.ts.map