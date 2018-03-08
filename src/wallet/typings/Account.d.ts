import { ScryptParams } from './core';

export interface AccountLike {
  address: string
  label: string
  isDefault: boolean
  lock: boolean
  key: string
  contract: object | null
  extra: object
}

/**
 * This allows for simple utilisation and manipulating of keys without need the long access methods.
 * Key formats are derived from each other lazily and stored for future access.
 * If the previous key (one level higher) is not found, it will attempt to generate it or throw an Error if insufficient information was provided (eg. trying to generate private key when only address was given.)
 * NEP2 <=> WIF <=> Private => Public => ScriptHash <=> Address
 */
export class Account {
  constructor(str: string|object)

  encrypted: string
  WIF: string
  privateKey: string
  publicKey: string
  scriptHash: string
  address: string

  /** Retrieves the Public Key in encoded / unencoded form. */
  getPublicKey(encoded: boolean): string

  /** Encrypts the current privateKey and return the Account object. */
  encrypt(keyphrase: string, scryptParams?: ScryptParams): Account

  /** Decrypts the encrypted key and return the Account object. */
  decrypt(keyphrase: string, scryptParams?: ScryptParams): Account

  /** Export Account as a AccountLike object. */
  export(): AccountLike
}
