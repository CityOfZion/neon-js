import { TX_VERSION_V3 } from "../../consts";
import logger from "../../logging";
import {
  hash256,
  num2hexstring,
  reverseHex,
  str2hexstring,
  Fixed8,
  StringStream,
  num2VarInt
} from "../../u";
import { Account, sign } from "../../wallet";
import {
  TransactionAttribute,
  TransactionAttributeLike,
  Witness,
  WitnessLike
} from "../components";
import TxAttrUsage from "../txAttrUsage";
import {
  serializeArrayOf,
  deserializeType,
  deserializeVersion,
  deserializeScript,
  deserializeSystemFee,
  deserializeAttributes,
  deserializeWitnesses
} from "./main";
const log = logger("tx_v3");

export interface TransactionLike {
  version: number;
  attributes: TransactionAttributeLike[];
  scripts: WitnessLike[];
  script: string;
  gas: number | Fixed8;
}

export class Transaction {
  public version: number;
  public attributes: TransactionAttribute[];
  public scripts: Witness[];
  public script: string;
  public gas: Fixed8;

  public constructor(tx: Partial<TransactionLike> = {}) {
    this.version = tx.version || TX_VERSION_V3;
    this.attributes = Array.isArray(tx.attributes)
      ? tx.attributes.map(a => new TransactionAttribute(a))
      : [];
    this.scripts = Array.isArray(tx.scripts)
      ? tx.scripts.map(a => new Witness(a))
      : [];
    this.script = tx.script || "";
    this.gas = new Fixed8(tx.gas);
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

  public get fees(): number {
    return this.gas.toNumber();
  }

  /**
   * Deserializes a hexstring into a Transaction object.
   * @param {string} hexstring - Hexstring of the transaction.
   */
  public static deserialize(hex: string): Transaction {
    const ss = new StringStream(hex);
    let txObj = deserializeType(ss);
    txObj = deserializeVersion(ss, txObj);
    txObj = deserializeScript(ss, txObj);
    txObj = deserializeSystemFee(ss, txObj);
    txObj = deserializeAttributes(ss, txObj);
    if (!ss.isEmpty()) {
      txObj = deserializeWitnesses(ss, txObj);
    }
    return new Transaction(txObj);
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
   * Serialize the transaction and return it as a hexstring.
   * @param {boolean} signed  - Whether to serialize the signatures. Signing requires it to be serialized without the signatures.
   * @return {string} Hexstring.
   */
  public serialize(signed: boolean = true): string {
    let out = "";
    out += num2hexstring(this.version);
    out += num2VarInt(this.script.length / 2);
    out += this.script;
    if (this.version > 0) {
      throw new Error(`Version must be 0`);
    }
    out += this.gas.toReverseHex();
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

  public equals(other: Partial<TransactionLike>): boolean {
    if (other instanceof Transaction) {
      return this.hash === other.hash;
    }
    return this.hash === new Transaction(other).hash;
  }

  public export(): TransactionLike {
    return {
      version: this.version,
      attributes: this.attributes.map(a => a.export()),
      scripts: this.scripts.map(a => a.export()),
      script: this.script,
      gas: this.gas.toNumber()
    };
  }
}

export default Transaction;
