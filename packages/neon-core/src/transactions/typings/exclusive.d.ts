import { StringStream } from '../../utils'
import { TransactionInput } from './components';
import { Transaction } from './Transaction';

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
