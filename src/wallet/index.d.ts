import { Fixed8 } from '../utils'
import { Transaction } from '../transactions/index'

export interface Account {
  WIF: string
  privateKey: string
  publicKey: string
  scriptHash: string
  address: string
}

export interface AssetBalance {
  balance: Fixed8
  unspent: Coin[]
  spent: Coin[]
  unconfirmed: Coin[]
}

export interface Coin {
  index: number
  txid: string
  value: Fixed8
}

export interface ClaimItem {
  claim: Fixed8
  txid: string
  index: number
  value: number
  start?: Fixed8
  end?: Fixed8
}

export interface ScryptParams {
  cost: number
  blockSize: number
  parallel: number
}

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

//Account
export class Account {
  constructor(str: string)

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

//Balance
export class Balance {
  constructor(bal?: Balance)

  address: string
  net: 'MainNet' | 'TestNet'
  assetSymbols: string[]
  assets: { [index: string]: AssetBalance }
  tokenSymbols: string[]
  tokens: { [index: string]: number }

  static import(jsonString: string): Balance

  addAsset(sym: string, assetBalance?: AssetBalance): this
  addToken(sym: string, tokenBalance?: number | Fixed8): this
  applyTx(tx: Transaction, confirmed?: boolean): this
  export(): string
  verifyAssets(url: string): Promise<Balance>
}

//Claims
export class Claims {
  constructor(claims?: Claims)

  address: string
  net: string
  claims: ClaimItem[]
}

//components
export function AssetBalance(assetBalance?: AssetBalance): AssetBalance
export function Coin(coin?: Coin): Coin
export function ClaimItem(claimItem?: ClaimItem): ClaimItem

//core
export function getPublicKeyEncoded(publicKey: string): string
export function getPublicKeyUnencoded(publicKey: string): string
export function getPrivateKeyFromWIF(wif: string): string
export function getWIFFromPrivateKey(privateKey: string): string
export function getPublicKeyFromPrivateKey(publicKey: string, encode?: boolean): string
export function getVerificationScriptFromPublicKey(publicKey: string): string
export function getScriptHashFromPublicKey(publicKey: string): string
export function getAddressFromScriptHash(scriptHash: string): string
export function getScriptHashFromAddress(address: string): string
export function generateSignature(tx: string, privateKey: string): string
export function generatePrivateKey(): string
export function generateRandomArray(length: number): string

//nep2
export function encrypt(wifKey: string, keyphrase: string, scryptParams?: ScryptParams): string
export function decrypt(encryptedKey: string, keyphrase: string, scryptParams?: ScryptParams): string
export function encryptAsync(wifKey: string, keyphrase: string, scryptParams?: ScryptParams): string
export function decryptAsync(encryptedKey: string, keyphrase: string, scryptParams?: ScryptParams): string

//verify
export function isNEP2(nep2: string): boolean
export function isWIF(wif: string): boolean
export function isPrivateKey(key: string): boolean
export function isPublicKey(key: string, encoded?: boolean): boolean
export function isAddress(address: string): boolean

//Wallet
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


