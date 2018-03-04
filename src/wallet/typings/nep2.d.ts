import { ScryptParams } from './core';

export function encrypt(wifKey: string, keyphrase: string, scryptParams?: ScryptParams): string
export function decrypt(encryptedKey: string, keyphrase: string, scryptParams?: ScryptParams): string
export function encryptAsync(wifKey: string, keyphrase: string, scryptParams?: ScryptParams): string
export function decryptAsync(encryptedKey: string, keyphrase: string, scryptParams?: ScryptParams): string
