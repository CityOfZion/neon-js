import { Account, AccountLike } from './Account';

export interface WalletLike {
  name: string
  scrypt: WalletScryptParams
  accounts: (Account|AccountLike)[]
  extra: object
}

export interface WalletScryptParams {
  n: number
  r: number
  p: number
}

/** Wallet class to read and integrate a Wallet file into the library. This class is responsible for ensuring that the Wallet File is read correctly and usable by the library. */
export class Wallet {
  name: string
  scrypt: WalletScryptParams
  accounts: Account[]
  extra: object

  constructor(file: WalletLike)

  /** Imports a Wallet through a JSON string */
  static import(jsonString: string): Wallet

  /**Reads a Wallet file sync  */
  static readFile(filepath: string): Wallet

  /** Adds an account. */
  addAccount(acct: Account | object): number

  /** Attempts to decrypt Account at index in array. */
  decrypt(index: number, keyphrase: string): boolean

  /** Attempts to decrypt all accounts with keyphrase. */
  decryptAll(keyphrase: string): boolean[]

  /** Attempts to encrypt Account at index in array. */
  encrypt(index: number, keyphrase: string): boolean

  /** Attempts to encrypt all accounts with keyphrase. */
  encryptAll(keyphrase: string): boolean[]

  /** Export this class as a object */
  export(): WalletLike

  /** Set Account at index in array to be default account. */
  setDefault(index: number): this

  /** Writes the Wallet file to a file. */
  writeFile(filepath: string): boolean
}
