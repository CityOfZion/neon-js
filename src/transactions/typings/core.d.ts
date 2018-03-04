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

export function calculateInputs(balances: Balance, intents: TransactionOutput[], gasCost?: number): { inputs: TransactionInput[], change: TransactionOutput[] }
export function serializeTransaction(tx: Transaction, signed?: boolean): string
export function deserializeTransaction(data: string): Transaction
export function signTransaction(transaction: Transaction, privateKey: string): Transaction
export function getTransactionHash(transaction: Transaction): string
