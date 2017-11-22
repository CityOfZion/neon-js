import { NEO_NETWORK } from '../consts'
import { StringStream } from '../utils'
import { scriptParams } from '../sc'

interface TransactionAttribute {
  data: string
  usage: number
}

interface TransactionInput {
  prevHash: string
  prevIndex: number
}

interface TransactionOutput {
  assetId: string
  scriptHash: string
  value: number
}

interface Witness {
  invocationScript: string
  verificationScript: string
}

interface Balance {
  GAS: TokenBalance
  NEO: TokenBalance
  address: string
  net: Net
}

interface Claim {
  claim: number
  index: number
  txid: string
}

interface ClaimData {
  claims: Claim[]
}

interface Coin {
  index: number
  txid: string
  value: number
}

interface TokenBalance {
  balance: number
  unspent: Coin[]
}

//components
export function serializeTransactionInput(input: TransactionInput): string
export function deserializeTransactionInput(stream: StringStream): TransactionInput
export function serializeTransactionOutput(output: TransactionOutput): string
export function deserializeTransactionOutput(stream: StringStream): TransactionOutput
export function createTransactionOutput(assetSym: string, value: number, address: string): TransactionOutput
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
interface txConfig {
  type: number,
  version: number,
  attributes: TransactionAttribute[]
  inputs: TransactionInput[]
  outputs: TransactionOutput[]
  scripts: Witness[]
}


export class Transaction {
  public type: number
  public version: number
  public attributes: TransactionAttribute[]
  public inputs: TransactionInput[]
  public outputs: TransactionOutput[]
  public scripts: Witness[]

  constructor(TxConfig)

  get exclusiveData(): object
  get hash(): string

  static createClaimTx(publicKeyOrAddress: string, claimData: Claim, override: object): Transaction
  static createContractTx(balances: Balance, intents: TransactionOutput[], override: object): Transaction
  static createInvocationTx(balance: Balance, intents: TransactionOutput[], invoke: object | string, gasCost: number, override: object): Transaction
}
