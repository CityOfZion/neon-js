import { Balance, Claims } from '../../wallet';
import {
  TransactionInput,
  TransactionAttribute,
  TransactionOutput,
  Witness,
} from './components';

/**
 * Transactions are what you use to interact with the blockchain.
 * A transaction is made up of components found in the component file.
 * Besides those components which are found in every transaction, there are also special data that is unique to each transaction type. These 'exclusive' data can be found in the exclusive file.
 * This class is a wrapper around the various transaction building methods found in this folder.
 */
export class Transaction {
  public type: number
  public version: number
  public attributes: TransactionAttribute[]
  public inputs: TransactionInput[]
  public outputs: TransactionOutput[]
  public scripts: Witness[]

  constructor(tx: Transaction)

  /** Exclusive Data */
  exclusiveData(): object

  /** Transaction hash. */
  hash(): string

  /** Creates a ClaimTransaction with the given parameters. */
  static createClaimTx(publicKeyOrAddress: string, claimData: Claims, override: object): Transaction

  /** Creates a ContractTransaction with the given parameters. */
  static createContractTx(balances: Balance, intents: TransactionOutput[], override: object): Transaction

  /** Creates an InvocationTransaction with the given parameters. */
  static createInvocationTx(balance: Balance, intents: TransactionOutput[], invoke: object | string, gasCost: number, override: object): Transaction

  static deserialize(hexstring: string): Transaction

  /** Adds a TransactionOutput. TransactionOutput can be given as a TransactionOutput object or as human-friendly values. This is detected by the number of arguments provided. */
  addOutput (assetSymOrTxOut: string|object, value: number, address: string): Transaction

  /** Add an attribute. */
  addAttribute (usage: number, data: string): Transaction

  /** Add a remark. */
  addRemark (remark: string): Transaction

  /** Calculate the inputs required based on existing outputs provided. Also takes into account the fees required through the gas property. */
  calculate (balance: Balance): Transaction

  /** Serialize the transaction and return it as a hexstring. */
  serialize (signed?: boolean): string

  /** Serializes the exclusive data in this transaction */
  serializeExclusiveData (): string

  /** Signs a transaction. */
  sign (signer: Account|string): Transaction
}
