import { Fixed8, StringStream } from '../../utils';
import {
  TransactionInput,
  TransactionAttribute,
  TransactionOutputLike,
  Witness,
} from './core';

/** Serializes a TransactionInput. */
export function serializeTransactionInput(input: TransactionInput): string

/** Deserializes a stream of hexstring into a TransactionInput. */
export function deserializeTransactionInput(stream: StringStream): TransactionInput

/** TransactionOutput */
export function TransactionOutput(input: TransactionOutputLike): TransactionOutputLike

/**Serializes a TransactionOutput*/
export function serializeTransactionOutput(output: TransactionOutputLike): string

/** Deserializes a stream into a TransactionOutput. */
export function deserializeTransactionOutput(stream: StringStream): TransactionOutputLike

/** A helper method to create a TransactionOutput using human-friendly inputs. */
export function createTransactionOutput(assetSym: string, value: number | Fixed8, address: string): TransactionOutputLike

/** Serializes a TransactionAttribute. */
export function serializeTransactionAttribute(attr: TransactionAttribute): string

/** Deserializes a stream into a TransactionAttribute */
export function deserializeTransactionAttribute(stream: StringStream): TransactionAttribute

/** Serializes a Witness. */
export function serializeWitness(witness: Witness): string

/** Deserializes a stream into a Witness */
export function deserializeWitness(stream: StringStream): Witness
