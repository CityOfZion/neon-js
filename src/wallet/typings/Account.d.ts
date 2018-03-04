import { ScryptParams } from './core';
import { WalletAccount } from './Wallet';

export class Account {
  constructor(str: string|object)

  WIF: string
  privateKey: string
  publicKey: string
  scriptHash: string
  address: string

  getPublicKey(encoded: boolean): string
  encrypt(keyphrase: string, scryptParams?: ScryptParams): Account
  decrypt(keyphrase: string, scryptParams?: ScryptParams): Account
  export(): WalletAccount
}
