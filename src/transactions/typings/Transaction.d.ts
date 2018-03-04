import { Balance, Claims } from '../../wallet';
import {
  TransactionInput,
  TransactionAttribute,
  TransactionOutput,
  Witness,
} from './core';

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
