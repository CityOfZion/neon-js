import { ScryptParams } from './core';

/** Encrypts a WIF key using a given keyphrase under NEP-2 Standard. */
export function encrypt(wifKey: string, keyphrase: string, scryptParams?: ScryptParams): string

/** Encrypts a WIF key using a given keyphrase under NEP-2 Standard. */
export function decrypt(encryptedKey: string, keyphrase: string, scryptParams?: ScryptParams): string

/** Decrypts an encrypted key using a given keyphrase under NEP-2 Standard. */
export function encryptAsync(wifKey: string, keyphrase: string, scryptParams?: ScryptParams): string

/** Decrypts an encrypted key using a given keyphrase under NEP-2 Standard. */
export function decryptAsync(encryptedKey: string, keyphrase: string, scryptParams?: ScryptParams): string
