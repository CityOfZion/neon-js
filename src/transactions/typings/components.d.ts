import { Fixed8, StringStream } from '../../utils';

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
  value: number|Fixed8
}

export interface Witness {
  invocationScript: string
  verificationScript: string
}


/** Serializes a TransactionInput. */
export function serializeTransactionInput(input: TransactionInput): string

/** Deserializes a stream of hexstring into a TransactionInput. */
export function deserializeTransactionInput(stream: StringStream): TransactionInput

/** TransactionOutput */
export function TransactionOutput(input: TransactionOutput): TransactionOutput

/**Serializes a TransactionOutput*/
export function serializeTransactionOutput(output: TransactionOutput): string

/** Deserializes a stream into a TransactionOutput. */
export function deserializeTransactionOutput(stream: StringStream): TransactionOutput

/** A helper method to create a TransactionOutput using human-friendly inputs. */
export function createTransactionOutput(assetSym: string, value: number | Fixed8, address: string): TransactionOutput

/** Serializes a TransactionAttribute. */
export function serializeTransactionAttribute(attr: TransactionAttribute): string

/** Deserializes a stream into a TransactionAttribute */
export function deserializeTransactionAttribute(stream: StringStream): TransactionAttribute

/** Serializes a Witness. */
export function serializeWitness(witness: Witness): string

/** Deserializes a stream into a Witness */
export function deserializeWitness(stream: StringStream): Witness

export const Witness :{
  buildMultiSig: (tx: string, sigs:Array<string | Witness>, acctOrVerificationScript: Account|Witness) => Witness
}
