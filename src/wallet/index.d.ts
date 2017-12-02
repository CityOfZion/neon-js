declare module '@cityofzion/neon-js' {
  export interface Account {
    WIF: string
    privateKey: string
    publicKey: string
    scriptHash: string
    address: string
  }

  export interface AssetBalance {
    balance: string
    unspent: Coin[]
    spent: Coin[]
    uncofirmed: Coin[]
  }

  export interface Coin {
    index: number
    txid: string
    value: number
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

  export module wallet {
    //Account
    export class Account {
      constructor(str: string)

      WIF: string
      privateKey: string
      publicKey: string
      scriptHash: string
      address: string

      getPublicKey(encoded: boolean): string
    }

    //Balance
    export class Balance {
      constructor(bal: object)

      address: string
      net: NEO_NETWORK
      assetSymbols: string[]
      assets: { [index: string]: AssetBalance }
      tokenSymbols: string[]
      tokens: { [index: string]: number }

      addAsset(sym: string, assetBalance?: AssetBalance): this
      addToken(sym: string, tokenBalance?: number): this
      applyTx(tx: Transaction, confirmed?: boolean): this
      verifyAssets(url: string): Promise<Balance>
    }

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
    export function encryptWifAccount(wif: string, passphrase: string): Promise<Account>
    export function generateEncryptedWif(passphrase: string): Promise<Account>
    export function encrypt(wifKey: string, keyphrase: string): string
    export function decrypt(encryptedKey: string, keyphrase: string): string
    export function encryptWIF(wif: string, passphrase: string): Promise<string>
    export function decryptWIF(encrypted: string, passphrase: string): Promise<string>

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
      writeFile(filepath): boolean
    }
  }

  export interface semantic {
    create: {
      account: (k: any) => Account
      privateKey: () => string
      signature: (tx: string, privateKey: string) => string
      wallet: (k: any) => Wallet
    }
    is: {
      address: (address: string) => boolean
      publicKey: (key: string, encode?: boolean) => boolean
      encryptedKey: (bep2: string) => string
      privateKey: (key: string) => string
      wif: (wif: string) => string
    }
    encrypt: {
      privateKey: (wifKey: string, keyphrase: string) => string
    }
    decrypt: {
      privateKey: (encryptedKey: string, keyphrase: string) => string
    }
    get: {
      privateKeyFromWIF: (wif: string) => string
      WIFFromPrivateKey: (privateKey: string) => string
      publicKeyFromPrivateKey: (publicKey: string, encode?: boolean) => string
      scriptHashFromPublicKey: (publicKey: string) => string
      addressFromScriptHash: (scriptHash: string) => string
      scriptHashFromAddress: (address: string) => string
    }
  }
}
