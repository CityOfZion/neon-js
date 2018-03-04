import { Fixed8, StringStream } from '../../utils';
import {
  TransactionInput,
  TransactionAttribute,
  TransactionOutput,
  Witness,
} from './core';

export function serializeTransactionInput(input: TransactionInput): string
export function deserializeTransactionInput(stream: StringStream): TransactionInput
export function serializeTransactionOutput(output: TransactionOutput): string
export function deserializeTransactionOutput(stream: StringStream): TransactionOutput
export function createTransactionOutput(assetSym: string, value: number | Fixed8, address: string): TransactionOutput
export function serializeTransactionAttribute(attr: TransactionAttribute): string
export function deserializeTransactionAttribute(stream: StringStream): TransactionAttribute
export function serializeWitness(witness: Witness): string
export function deserializeWitness(stream: StringStream): Witness
