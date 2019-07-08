import { TX_VERSION } from "../../consts";
import logger from "../../logging";
import {
  hash256,
  num2hexstring,
  reverseHex,
  str2hexstring,
  Fixed8
} from "../../u";
import { Account, Balance, sign } from "../../wallet";
import {
  TransactionAttribute,
  TransactionAttributeLike,
  Witness,
  WitnessLike
} from "../components";
import { calculationStrategyFunction } from "../strategy";
import TxAttrUsage from "../txAttrUsage";
import { serializeArrayOf } from "./main";
const log = logger("tx");

export interface TransactionLike {
  version: number;
  attributes: TransactionAttributeLike[];
  scripts: WitnessLike[];
  script: string;
  gas: number | Fixed8;
}

export abstract class BaseTransaction {
  public version: number;
  public attributes: TransactionAttribute[];
  public scripts: Witness[];

  public constructor(tx: Partial<TransactionLike> = {}) {
    this.version = tx.version || TX_VERSION.CONTRACT;
    this.attributes = Array.isArray(tx.attributes)
      ? tx.attributes.map(a => new TransactionAttribute(a))
      : [];
    this.scripts = Array.isArray(tx.scripts)
      ? tx.scripts.map(a => new Witness(a))
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
   * Serialize the transaction and return it as a hexstring.
   * @param {boolean} signed  - Whether to serialize the signatures. Signing requires it to be serialized without the signatures.
   * @return {string} Hexstring.
   */
  public serialize(signed: boolean = true): string {
    let out = "";
    out += num2hexstring(this.version);
    out += this.serializeExclusive();
    out += serializeArrayOf(this.attributes);
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
      version: this.version,
      attributes: this.attributes.map(a => a.export()),
      scripts: this.scripts.map(a => a.export())
    };
  }
}

export default BaseTransaction;
