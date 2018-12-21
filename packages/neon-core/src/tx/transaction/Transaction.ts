import { StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import { ClaimTransaction } from "./ClaimTransaction";
import { ContractTransaction } from "./ContractTransaction";
import { InvocationTransaction } from "./InvocationTransaction";
import {
  deserializeAttributes,
  deserializeInputs,
  deserializeOutputs,
  deserializeType,
  deserializeVersion,
  deserializeWitnesses
} from "./main";
import { StateTransaction } from "./StateTransaction";

/**
 * @class Transaction
 * @classdesc
 * Transactions are what you use to interact with the blockchain.
 * A transaction is made up of components found in the component file.
 * Besides those components which are found in every transaction, there are also special data that is unique to each transaction type. These 'exclusive' data can be found in the exclusive file.
 * This class is a wrapper around the various transaction building methods found in this folder.
 */
export class Transaction extends BaseTransaction {
  /**
   * Deserializes a hexstring into a Transaction object.
   * @param {string} hexstring - Hexstring of the transaction.
   */
  public static deserialize<T extends BaseTransaction>(hex: string): T {
    const ss = new StringStream(hex);
    let txObj = deserializeType(ss);
    const txClass = getType(txObj.type!);
    txObj = deserializeVersion(ss, txObj);
    txObj = txClass.deserializeExclusive(ss, txObj);
    txObj = deserializeAttributes(ss, txObj);
    txObj = deserializeInputs(ss, txObj);
    txObj = deserializeOutputs(ss, txObj);
    if (!ss.isEmpty()) {
      txObj = deserializeWitnesses(ss, txObj);
    }
    return new txClass(txObj);
  }

  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<TransactionLike>
  ): Partial<TransactionLike> {
    throw new Error("Method not implemented.");
  }

  private constructor(tx: Partial<TransactionLike> = {}) {
    super(tx);
  }

  get [Symbol.toStringTag]() {
    return "Transaction";
  }

  /**
   * Exclusive Data
   */
  get exclusiveData(): { [key: string]: any } {
    throw new Error("Not Implemented!");
  }

  get fees(): number {
    return 0;
  }

  public serializeExclusive(): string {
    throw new Error("Method not implemented.");
  }
}

export default Transaction;

function getType<T>(type: number): any {
  switch (type) {
    case 0x02:
      return ClaimTransaction;
    case 0x80:
      return ContractTransaction;
    case 0xd1:
      return InvocationTransaction;
    case 0x90:
      return StateTransaction;
    default:
      throw new Error(`Unknown TransactionType: ${type}`);
  }
}
