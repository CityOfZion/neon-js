export interface ScryptParams {
    n: number;
    r: number;
    p: number;
}
/**
 * Encrypts a WIF key using a given keyphrase under NEP-2 Standard.
 * @param {string} wifKey - WIF key to encrypt (52 chars long).
 * @param {string} keyphrase - The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param {scryptParams} [scryptParams] - Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns {Promise<string>} The encrypted key in Base58 (Case sensitive).
 */
export declare function encrypt(wifKey: string, keyphrase: string, scryptParams?: ScryptParams): Promise<string>;
/**
 * Decrypts an encrypted key using a given keyphrase under NEP-2 Standard.
 * @param encryptedKey The encrypted key (58 chars long).
 * @param keyphrase The password will be encoded as UTF-8 and normalized using Unicode Normalization Form C (NFC).
 * @param scryptParams Parameters for Scrypt. Defaults to NEP2 specified parameters.
 * @returns The decrypted WIF key.
 */
export declare function decrypt(encryptedKey: string, keyphrase: string, scryptParams?: ScryptParams): Promise<string>;
//# sourceMappingURL=nep2.d.ts.map