import { TX_VERSION } from "../../consts";
import logger from "../../logging";
import {
  hash256,
  num2hexstring,
  reverseHex,
  Fixed8,
  StringStream,
  num2VarInt,
  ensureHex,
  generateRandomArray,
  ab2hexstring
} from "../../u";
import { Account, sign } from "../../wallet";
import {
  TransactionAttribute,
  TransactionAttributeLike,
  Witness,
  WitnessLike
} from "../components";
import {
  serializeArrayOf,
  deserializeVersion,
  deserializeScript,
  deserializeFee,
  deserializeAttributes,
  deserializeWitnesses,
  formatSender,
  deserializeNonce,
  deserializeSender,
  deserializeValidUntilBlock
} from "./main";
const log = logger("tx");

export interface TransactionLike {
  version: number;
  nonce: number;
  sender: string;
  systemFee: Fixed8 | number;
  networkFee: Fixed8 | number;
  validUntilBlock: number;
  attributes: TransactionAttributeLike[];
  scripts: WitnessLike[];
  script: string;
}

export class Transaction {
  public version: number;
  /**
   * A random number to avoid hash collision
   */
  public nonce: number;
  /**
   * transation invoker in script hash
   */
  public sender: string;

  /**
   * Distributed to NEO holders
   */
  public systemFee: Fixed8;

  /**
   * Distributed to consensus nodes
   */
  public networkFee: Fixed8;

  /**
   * Current transaction will not be valid until block of height validUntilBlock
   */
  public validUntilBlock: number;
  public attributes: TransactionAttribute[];
  public scripts: Witness[];
  public script: string;

  public static MAX_VALIDUNTILBLOCK_INCREMENT = 2102400;

  public constructor(tx: Partial<TransactionLike> = {}) {
    if (tx.version && tx.version !== 0) {
      throw new Error(`Transaction version should be 0 not ${tx.version}`);
    }
    const {
      version,
      nonce,
      sender,
      systemFee,
      networkFee,
      validUntilBlock,
      attributes,
      scripts,
      script
    } = tx;
    this.version = version || TX_VERSION;
    this.nonce = nonce || parseInt(ab2hexstring(generateRandomArray(4)), 16);
    this.sender = formatSender(sender);
    this.systemFee = new Fixed8(systemFee);
    this.networkFee = new Fixed8(networkFee);
    // TODO: The default should be snapshot.height + MAX_VALIDUNTILBLOCK_INCREMENT, but it needs request to get block height, thus this is a temporary value
    this.validUntilBlock =
      validUntilBlock || Transaction.MAX_VALIDUNTILBLOCK_INCREMENT;
    this.attributes = Array.isArray(attributes)
      ? attributes.map(a => new TransactionAttribute(a))
      : [];
    this.scripts = Array.isArray(scripts)
      ? scripts.map(a => new Witness(a))
      : [];
    this.script = script || "";
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
    return this.systemFee.plus(this.networkFee).toNumber();
  }

  /**
   * Deserializes a hexstring into a Transaction object.
   * @param {string} hexstring - Hexstring of the transaction.
   */
  public static deserialize(hex: string): Transaction {
    const ss = new StringStream(hex);
    let txObj = deserializeVersion(ss);
    txObj = deserializeNonce(ss, txObj);
    txObj = deserializeSender(ss, txObj);
    txObj = deserializeFee(ss, txObj);
    txObj = deserializeValidUntilBlock(ss, txObj);
    txObj = deserializeAttributes(ss, txObj);
    txObj = deserializeScript(ss, txObj);
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
    if (this.version !== 0) {
      throw new Error(`Version must be 0`);
    }
    ensureHex(this.sender);
    let out = "";
    out += num2hexstring(this.version);
    out += num2hexstring(this.nonce);
    out += this.sender;
    out += this.systemFee.toReverseHex();
    out += this.networkFee.toReverseHex();
    out += num2hexstring(this.validUntilBlock);
    out += num2VarInt(this.script.length / 2);
    out += serializeArrayOf(this.attributes);
    out += this.script;
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
      nonce: this.nonce,
      sender: this.sender,
      systemFee: this.systemFee.toNumber(),
      networkFee: this.networkFee.toNumber(),
      validUntilBlock: this.validUntilBlock,
      attributes: this.attributes.map(a => a.export()),
      scripts: this.scripts.map(a => a.export()),
      script: this.script
    };
  }
}

export default Transaction;
