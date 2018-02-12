import { Fixed8, StringStream } from '../utils'
import { Balance, Claims } from '../wallet'

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

//components
export function serializeTransactionInput(input: TransactionInput): string
export function deserializeTransactionInput(stream: StringStream): TransactionInput
export function TransactionOutput(input: object): TransactionOutput
export function serializeTransactionOutput(output: TransactionOutput): string
export function deserializeTransactionOutput(stream: StringStream): TransactionOutput
export function createTransactionOutput(assetSym: string, value: number | Fixed8, address: string): TransactionOutput
export function serializeTransactionAttribute(attr: TransactionAttribute): string
export function deserializeTransactionAttribute(stream: StringStream): TransactionAttribute
export function serializeWitness(witness: Witness): string
export function deserializeWitness(stream: StringStream): Witness

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
  2: (stream: StringStream) => { claims: TransactionInput[] }
  128: (stream: StringStream) => {}
  209: (stream: StringStream) => { gas: number, script: string }
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

  constructor(tx: Transaction)

  exclusiveData(): object
  hash(): string

  static createClaimTx(publicKeyOrAddress: string, claimData: Claims, override: object): Transaction
  static createContractTx(balances: Balance, intents: TransactionOutput[], override: object): Transaction
  static createInvocationTx(balance: Balance, intents: TransactionOutput[], invoke: object | string, gasCost: number, override: object): Transaction
}
//txAttrUsage
export enum TxAttrUsage { }


