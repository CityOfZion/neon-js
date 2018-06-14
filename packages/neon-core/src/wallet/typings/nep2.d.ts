import { ScryptParams } from './core';

/** Encrypts a WIF key using a given keyphrase under NEP-2 Standard. */
export function encrypt(wifKey: string, keyphrase: string, scryptParams?: ScryptParams): Promise<string>

/** Decrypts an encrypted key using a given keyphrase under NEP-2 Standard. */
export function decrypt(encryptedKey: string, keyphrase: string, scryptParams?: ScryptParams): Promise<string>

