export interface WalletFile {
  name: string
  scrypt: WalletScryptParams
  accounts: WalletAccount[]
  extra: object
}

export interface WalletScryptParams {
  n: number
  r: number
  p: number
}

export interface WalletAccount {
  address: string
  label: string
  isDefault: boolean
  lock: boolean
  key: string
  contract: object | null
  extra: object
}

export class Wallet {
  name: string
  scrypt: WalletScryptParams
  accounts: Account[]
  extra: object

  constructor(file: WalletFile)

  static import(jsonString: string): Wallet
  static readFile(filepath: string): Wallet

  addAccount(acct: Account | object): number
  decrypt(index: number, keyphrase: string): boolean
  decryptAll(keyphrase: string): boolean[]
  encrypt(index: number, keyphrase: string): boolean
  encryptAll(keyphrase: string): boolean[]
  export(): string
  setDefault(index: number): this
  writeFile(filepath: string): boolean
}
