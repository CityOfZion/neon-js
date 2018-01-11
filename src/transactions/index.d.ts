declare module '@cityofzion/neon-js' {
  export interface Transaction {
    type: number
    version: number
    attributes: TransactionAttribute[]
    inputs: TransactionInput[]
    outputs: TransactionOutput[]
    scripts: Witness[]
  }

  export interface TransactionAttribute {
    data: string
    usage: number
  }

  export interface TransactionInput {
    prevHash: string
    prevIndex: number
  }

  export interface TransactionOutput {
    assetId: string
    scriptHash: string
    value: Fixed8
  }

  export interface Witness {
    invocationScript: string
    verificationScript: string
  }

  export interface Balance {
    GAS: TokenBalance
    NEO: TokenBalance
    address: string
    net: 'MainNet' | 'TestNet'
  }

  export interface Claim {
    claim: number
    index: number
    txid: string
  }

  interface ClaimData {
    claims: Claim[]
  }

  interface txConfig {
    type: number,
    version: number,
    attributes: TransactionAttribute[]
    inputs: TransactionInput[]
    outputs: TransactionOutput[]
    scripts: Witness[]
  }

  export module tx {
    //components
    export function serializeTransactionInput(input: TransactionInput): string
    export function deserializeTransactionInput(stream: u.StringStream): TransactionInput
    export function TransactionOutput(input: object): TransactionOutput
    export function serializeTransactionOutput(output: TransactionOutput): string
    export function deserializeTransactionOutput(stream: u.StringStream): TransactionOutput
    export function createTransactionOutput(assetSym: string, value: number|Fixed8, address: string): TransactionOutput
    export function serializeTransactionAttribute(attr: TransactionAttribute): string
    export function deserializeTransactionAttribute(stream: u.StringStream): TransactionAttribute
    export function serializeWitness(witness: Witness): string
    export function deserializeWitness(stream: u.StringStream): Witness

    //core
    export function calculateInputs(balances: Balance, intents: TransactionOutput[], gasCost?: number): { inputs: TransactionInput[], change: TransactionOutput[] }
    export function serializeTransaction(tx: Transaction, signed?: boolean): string
    export function deserializeTransaction(data: string): Transaction
    export function signTransaction(transaction: Transaction, privateKey: string): Transaction
    export function getTransactionHash(transaction: Transaction): string

    //exclusive
    export const serializeExclusive: {
      2: (tx: Transaction) => string
      128: (tx: Transaction) => ''
      209: (tx: Transaction) => string
    }

    export const deserializeExclusive: {
      2: (stream: u.StringStream) => { claims: TransactionInput[] }
      128: (stream: u.StringStream) => {}
      209: (stream: u.StringStream) => { gas: number, script: string }
    }

    export const getExclusive: {
      2: (tx: Transaction) => { claims: TransactionInput[] }
      128: (tx: Transaction) => {}
      209: (tx: Transaction) => { gas: number, script: string }
    }

    //transaction
    export class Transaction {
      public type: number
      public version: number
      public attributes: TransactionAttribute[]
      public inputs: TransactionInput[]
      public outputs: TransactionOutput[]
      public scripts: Witness[]

      constructor(TxConfig)

      exclusiveData(): object
      hash(): string

      static createClaimTx(publicKeyOrAddress: string, claimData: Claim, override: object): Transaction
      static createContractTx(balances: Balance, intents: TransactionOutput[], override: object): Transaction
      static createInvocationTx(balance: Balance, intents: TransactionOutput[], invoke: object | string, gasCost: number, override: object): Transaction
    }

    export enum TxAttrUsage {}
  }

  export interface semantic {
    create: {
      tx: (args: any[]) => Transaction
      claimTx: (publicKeyOrAddress: string, claimData: Claim, override: object) => Transaction
      contractTx: (balances: Balance, intents: TransactionOutput[], override: object) => Transaction
      invocationTx: (balance: Balance, intents: TransactionOutput[], invoke: object | string, gasCost: number, override: object) => Transaction
    }
    serialize: {
      attribute: (attr: TransactionAttribute) => string
      input: (input: TransactionInput) => string
      output: (output: TransactionOutput) => string
      exclusiveData: object
      tx: (tx: Transaction) => string
    }
    deserialize: {
      attribute: (stream: StringStream) => TransactionAttribute
      input: (stream: StringStream) => TransactionInput
      output: (stream: StringStream) => TransactionOutput
      exclusiveData: object
      tx: (stream: StringStream) => Transaction
    }
    get: {
      transactionHash: (transaction: Transaction) => string
    }
    sign: {
      transaction: (transaction: Transaction, privateKey: string) => Transaction
    }
  }
}
