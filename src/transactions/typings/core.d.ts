import { Fixed8 } from '../../utils';
import { Balance } from '../../wallet'
import { Transaction } from './Transaction';

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

/** Calculate the inputs required given the intents and gasCost. gasCost has to be seperate because it will not be reflected as an TransactionOutput. */
export function calculateInputs(balances: Balance, intents: TransactionOutput[], gasCost?: number): { inputs: TransactionInput[], change: TransactionOutput[] }

/** Serializes a given transaction object */
export function serializeTransaction(tx: Transaction, signed?: boolean): string

/** Deserializes a given string into a Transaction object */
export function deserializeTransaction(data: string): Transaction

/** Signs a transaction with the corresponding privateKey. We are dealing with it as an Transaction object as multi-sig transactions require us to sign the transaction without signatures. */
export function signTransaction(transaction: Transaction, privateKey: string): Transaction

/** Get hash value of a transaction */
export function getTransactionHash(transaction: Transaction): string
