import { TX_VERSION } from "../../consts";
import logger from "../../logging";
import {
  Fixed8,
  hash256,
  num2hexstring,
  reverseHex,
  str2hexstring,
} from "../../u";
import { Account, Balance, sign } from "../../wallet";
import { calculateInputs } from "../calculate";
import {
  TransactionAttribute,
  TransactionAttributeLike,
  TransactionInput,
  TransactionInputLike,
  TransactionOutput,
  TransactionOutputLike,
  Witness,
  WitnessLike,
} from "../components";
import { calculationStrategyFunction } from "../strategy";
import TxAttrUsage from "../txAttrUsage";
import { serializeArrayOf } from "./main";
import TransactionType from "./TransactionType";
const log = logger("tx");

export interface TransactionLike {
  type: number;
  version: number;
  attributes: TransactionAttributeLike[];
  inputs: TransactionInputLike[];
  outputs: TransactionOutputLike[];
  scripts: WitnessLike[];
}

export abstract class BaseTransaction {
  public readonly type: TransactionType = 0x00;
  public version: number;
  public attributes: TransactionAttribute[];
  public inputs: TransactionInput[];
  public outputs: TransactionOutput[];
  public scripts: Witness[];

  public constructor(tx: Partial<TransactionLike> = {}) {
    this.version = tx.version || TX_VERSION.CONTRACT;
    this.attributes = Array.isArray(tx.attributes)
      ? tx.attributes.map((a) => new TransactionAttribute(a))
      : [];
    this.inputs = Array.isArray(tx.inputs)
      ? tx.inputs.map((a) => new TransactionInput(a))
      : [];
    this.outputs = Array.isArray(tx.outputs)
      ? tx.outputs.map((a) => new TransactionOutput(a))
      : [];
    this.scripts = Array.isArray(tx.scripts)
      ? tx.scripts.map((a) => new Witness(a))
      : [];
  }

  public get [Symbol.toStringTag](): string {
    return "Transaction";
  }
  /**
   * Transaction hash.
   */
  public get hash(): string {
    return reverseHex(hash256(this.serialize(false)));
  }

  abstract get fees(): number;

  abstract get exclusiveData(): { [key: string]: any };

  public abstract serializeExclusive(): string;

  public addOutput(txOut: TransactionOutputLike): this {
    this.outputs.push(new TransactionOutput(txOut));
    return this;
  }

  /**
   * Adds a TransactionOutput. TransactionOutput can be given as a TransactionOutput object or as human-friendly values. This is detected by the number of arguments provided.
   * @param symbol The symbol of the asset (eg NEO or GAS).
   * @param value The value to send.
   * @param address The address to send to.
   */
  public addIntent(
    symbol: string,
    value: number | Fixed8,
    address: string
  ): this {
    this.outputs.push(TransactionOutput.fromIntent(symbol, value, address));
    return this;
  }

  /**
   * Add an attribute.
   * @param usage The usage type. Do refer to txAttrUsage enum values for all available options.
   * @param data The data as hexstring.
   */
  public addAttribute(usage: number, data: string): this {
    if (typeof data !== "string") {
      throw new TypeError("data should be formatted as string!");
    }
    this.attributes.push(new TransactionAttribute({ usage, data }));
    return this;
  }

  /**
   * Add a remark.
   * @param remark A remark in ASCII.
   */
  public addRemark(remark: string): this {
    const hexRemark = str2hexstring(remark);
    return this.addAttribute(TxAttrUsage.Remark, hexRemark);
  }

  /**
   * Adds an Witness to the Transaction and automatically sorts the witnesses according to scripthash.
   * @param witness The Witness object to add.
   */
  public addWitness(witness: Witness): this {
    if (witness.scriptHash === "") {
      throw new Error("Please define the scriptHash for this Witness!");
    }
    this.scripts.push(witness);
    this.scripts = this.scripts.sort(
      (w1, w2) => parseInt(w1.scriptHash, 16) - parseInt(w2.scriptHash, 16)
    );
    return this;
  }

  /**
   * Calculate the inputs required based on existing outputs provided. Also takes into account the fees required through the gas property.
   * @param balance Balance to retrieve inputs from.
   * @param strategy
   * @param fees Additional network fees. Invocation gas and tx fees are already included automatically so this is additional fees for priority on the network.
   */
  public calculate(
    balance: Balance,
    strategy?: calculationStrategyFunction,
    fees: number | Fixed8 = 0
  ): this {
    const { inputs, change } = calculateInputs(
      balance,
      this.outputs,
      new Fixed8(this.fees).add(fees),
      strategy
    );
    this.inputs = inputs;
    this.outputs = this.outputs.concat(change);
    log.info(
      `Calculated the inputs required for Transaction with Balance: ${balance.address}`
    );
    return this;
  }

  /**
   * Serialize the transaction and return it as a hexstring.
   * @param {boolean} signed  - Whether to serialize the signatures. Signing requires it to be serialized without the signatures.
   * @return {string} Hexstring.
   */
  public serialize(signed = true): string {
    let out = "";
    out += num2hexstring(this.type);
    out += num2hexstring(this.version);
    out += this.serializeExclusive();
    out += serializeArrayOf(this.attributes);
    out += serializeArrayOf(this.inputs);
    out += serializeArrayOf(this.outputs);
    if (signed) {
      out += serializeArrayOf(this.scripts);
    }
    return out;
  }

  /**
   * Signs a transaction.
   * @param {Account|string} signer - Account, privateKey or WIF
   * @return {Transaction} this
   */
  public sign(signer: Account | string): this {
    if (typeof signer === "string") {
      signer = new Account(signer);
    }
    const signature = sign(this.serialize(false), signer.privateKey);
    log.info(`Signed Transaction with Account: ${signer.label}`);
    this.addWitness(Witness.fromSignature(signature, signer.publicKey));
    return this;
  }

  public export(): TransactionLike {
    return {
      type: this.type,
      version: this.version,
      attributes: this.attributes.map((a) => a.export()),
      inputs: this.inputs.map((a) => a.export()),
      outputs: this.outputs.map((a) => a.export()),
      scripts: this.scripts.map((a) => a.export()),
    };
  }
}

export default BaseTransaction;
