import { TX_VERSION, MAGIC_NUMBER } from "../../consts";
import logger from "../../logging";
import {
  hash256,
  num2hexstring,
  reverseHex,
  Fixed8,
  StringStream,
  num2VarInt,
  generateRandomArray,
  ab2hexstring,
  HexString,
} from "../../u";
import {
  Account,
  sign,
  getAddressFromScriptHash,
  getScriptHashFromAddress,
} from "../../wallet";
import {
  TransactionAttribute,
  TransactionAttributeLike,
  Witness,
  WitnessLike,
  TransactionAttributeJson,
  WitnessJson,
} from "../components";
import {
  deserializeVersion,
  deserializeScript,
  deserializeFee,
  deserializeAttributes,
  deserializeWitnesses,
  deserializeNonce,
  deserializeSender,
  deserializeValidUntilBlock,
  deserializeCosigners,
} from "./main";
import { CosignerLike, Cosigner, CosignerJson } from "../components/Cosigner";
import { serializeArrayOf } from "../lib";
import { NeonObject } from "../../model";
const log = logger("tx");

export interface TransactionLike {
  version: number;
  nonce: number;
  sender: string;
  systemFee: Fixed8 | number;
  networkFee: Fixed8 | number;
  validUntilBlock: number;
  attributes: TransactionAttributeLike[];
  cosigners: CosignerLike[];
  witnesses: WitnessLike[];
  script: string;
}

export interface TransactionJson {
  hash?: string;
  size: number;
  version: number;
  nonce: number;
  sender: string;
  sys_fee: string;
  net_fee: string;
  valid_until_block: number;
  attributes: TransactionAttributeJson[];
  cosigners: CosignerJson[];
  // base64-encoded
  script: string;
  witnesses: WitnessJson[];
}

export class Transaction implements NeonObject<TransactionLike> {
  /**
   * Only version=0 is valid for NEO3
   */
  public version: number;
  /**
   * A random 4-byte number to avoid hash collision, range [0, 2**32)
   */
  public nonce: number;
  /**
   * transation invoker in script hash in big endian
   */
  public sender: HexString;

  /**
   * Distributed to NEO holders
   * systemFee is calculated by summarizing prices of all the opcodes and interopServices used while executing transaction script in vm.
   *
   * @example
   * const systemFee = SUM(OpCodePrices + InteropServiceCodePrices)
   *
   * @description
   * The most reliable way to calculate minimum systemFee is to use invokeScript method to test, as it's hard to know what the contract will do.
   * If transaction only invokes native contracts, systemFee can be calculated offline.
   */
  public systemFee: Fixed8;

  /**
   * Distributed to consensus nodes
   * networkFee is calculated according to transaction size and verificationScript cost in witnesses.
   *
   * @example
   * const networkFee = FeePerByte * txSize + SUM(verificationScriptCost)
   *
   * @description
   * First part of networkFee is counted by transaction size by unit price `FeePerByte`
   * `verificationScriptCost` is calculated by summing up opcodes and interopService prices, like `systemFee`; contract verificationScript may need to be run in the VM to get the exact price.
   */
  public networkFee: Fixed8;

  /**
   * Current transaction will be invalid after block of height validUntilBlock
   */
  public validUntilBlock: number;
  public attributes: TransactionAttribute[];
  public cosigners: Cosigner[];
  public witnesses: Witness[];
  public script: HexString;

  /**
   * @description Maximum duration in blocks that a transaction can stay valid in the mempol
   */
  public static MAX_TRANSACTION_LIFESPAN = 2102400;

  public static fromJson(input: TransactionJson): Transaction {
    return new Transaction({
      version: input.version,
      nonce: input.nonce,
      sender: HexString.fromHex(getScriptHashFromAddress(input.sender)),
      systemFee: new Fixed8(input.sys_fee).div(100000000),
      networkFee: new Fixed8(input.net_fee).div(100000000),
      validUntilBlock: input.valid_until_block,
      attributes: input.attributes.map((a) => TransactionAttribute.fromJson(a)),
      cosigners: input.cosigners.map((c) => Cosigner.fromJson(c)),
      script: HexString.fromBase64(input.script),
      witnesses: input.witnesses.map((w) => Witness.fromJson(w)),
    });
  }

  public constructor(tx: Partial<TransactionLike | Transaction> = {}) {
    const {
      version,
      nonce,
      sender,
      systemFee,
      networkFee,
      validUntilBlock,
      attributes,
      cosigners = [],
      witnesses,
      script,
    } = tx;
    this.version = version ?? TX_VERSION;
    this.nonce = nonce ?? parseInt(ab2hexstring(generateRandomArray(4)), 16);
    this.sender = HexString.fromHex(sender ?? "");
    this.validUntilBlock = validUntilBlock ?? 0;
    this.attributes = Array.isArray(attributes)
      ? (attributes as (TransactionAttribute | TransactionAttributeLike)[]).map(
          (a) => new TransactionAttribute(a)
        )
      : [];
    this.witnesses = Array.isArray(witnesses)
      ? (witnesses as (Witness | WitnessLike)[]).map((a) => new Witness(a))
      : [];
    this.witnesses = this.witnesses.sort(
      (w1, w2) => parseInt(w1.scriptHash, 16) - parseInt(w2.scriptHash, 16)
    );
    this.cosigners = [];
    cosigners.forEach((cosigner) => this.addCosigner(cosigner));
    this.systemFee = systemFee ? new Fixed8(systemFee) : new Fixed8(0);
    this.networkFee = networkFee ? new Fixed8(networkFee) : new Fixed8(0);
    this.script = HexString.fromHex(script ?? "");
  }

  public get [Symbol.toStringTag](): string {
    return "Transaction";
  }
  /**
   * Transaction hash.
   */
  public hash(networkMagic: number): string {
    return reverseHex(
      hash256(num2hexstring(networkMagic, 4) + this.serialize(false))
    );
  }

  public get size(): number {
    return (
      this.headerSize +
      num2VarInt(this.attributes.length).length / 2 +
      this.attributes.reduce((sum, a) => sum + a.size, 0) +
      num2VarInt(this.cosigners.length).length / 2 +
      this.cosigners.reduce((sum, c) => sum + c.size, 0) +
      num2VarInt(this.script.byteLength).length / 2 +
      this.script.byteLength +
      num2VarInt(this.witnesses.length).length / 2 +
      this.witnesses.reduce((sum, w) => sum + w.size, 0)
    );
  }

  public get fees(): number {
    return this.systemFee.plus(this.networkFee).toNumber();
  }

  /**
   * Transaction header size
   */
  public get headerSize(): number {
    return (
      /* version */ 1 +
      /* nonce */ 4 /* sender */ +
      20 +
      /* systemFee */ 8 +
      /* networkFee */ 8 +
      /* validUntilBlock */ 4
    );
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
    txObj = deserializeCosigners(ss, txObj);
    txObj = deserializeScript(ss, txObj);
    if (!ss.isEmpty()) {
      txObj = deserializeWitnesses(ss, txObj);
    }
    return new Transaction(txObj);
  }

  public addCosigner(newCosigner: CosignerLike | Cosigner): this {
    const acctHashes = this.cosigners.map((cosigner) => cosigner.account);
    const newHash = HexString.fromHex(newCosigner.account);
    if (acctHashes.find((hash) => hash.equals(newHash))) {
      throw new Error(`Cannot add duplicate cosigner: ${newCosigner.account}`);
    }
    this.cosigners.push(new Cosigner(newCosigner));
    return this;
  }

  public addAttribute(attr: TransactionAttributeLike): this {
    this.attributes.push(new TransactionAttribute(attr));
    return this;
  }

  /**
   * Adds Witness to the Transaction and automatically sorts the witnesses according to scripthash.
   * @param obj The Witness object to add as witness
   */
  public addWitness(obj: WitnessLike | Witness): this {
    this.witnesses.push(new Witness(obj));
    this.witnesses = this.witnesses.sort(
      (w1, w2) => parseInt(w1.scriptHash, 16) - parseInt(w2.scriptHash, 16)
    );
    return this;
  }

  /**
   * Serialize the transaction and return it as a hex .
   * @param {boolean} signed  - Whether to serialize the signatures. Signing requires it to be serialized without the signatures.
   * @return {string} Hexstring.
   */
  public serialize(signed = true): string {
    if (this.version !== 0) {
      throw new Error(`Version must be 0`);
    }
    let out = "";
    out += num2hexstring(this.version);
    out += num2hexstring(this.nonce, 4, true);
    out += this.sender.toLittleEndian();
    out += this.systemFee.toReverseHex();
    out += this.networkFee.toReverseHex();
    out += num2hexstring(this.validUntilBlock, 4, true);
    out += serializeArrayOf(this.attributes);
    out += serializeArrayOf(this.cosigners);
    out += num2VarInt(this.script.byteLength);
    out += this.script.toString();
    if (signed) {
      out += serializeArrayOf(this.witnesses);
    }
    return out;
  }

  /**
   * Signs a transaction.
   * @param {Account|string} signer - Account, privateKey or WIF
   * @param {number} networkMagic Magic number of network found in protocol.json.
   * @return {Transaction} this
   */
  public sign(
    signer: Account | string,
    networkMagic: number = MAGIC_NUMBER.MainNet
  ): this {
    if (typeof signer === "string") {
      signer = new Account(signer);
    }
    const signature = sign(
      num2hexstring(networkMagic, 4) + this.serialize(false),
      signer.privateKey
    );
    log.info(`Signed Transaction with Account: ${signer.label}`);
    this.addWitness(Witness.fromSignature(signature, signer.publicKey));
    return this;
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (other instanceof Transaction) {
      return this.hash(0) === other.hash(0);
    }
    return this.hash(0) === new Transaction(other).hash(0);
  }

  public export(): TransactionLike {
    return {
      version: this.version,
      nonce: this.nonce,
      sender: this.sender.toBigEndian(),
      systemFee: this.systemFee.toNumber(),
      networkFee: this.networkFee.toNumber(),
      validUntilBlock: this.validUntilBlock,
      attributes: this.attributes.map((a) => a.export()),
      cosigners: this.cosigners.map((cosigner) => cosigner.export()),
      witnesses: this.witnesses.map((a) => a.export()),
      script: this.script.toBigEndian(),
    };
  }

  public toJson(): TransactionJson {
    return {
      size: this.size,
      version: this.version,
      nonce: this.nonce,
      sender: getAddressFromScriptHash(this.sender.toBigEndian()),
      sys_fee: this.systemFee.toRawNumber().toString(),
      net_fee: this.networkFee.toRawNumber().toString(),
      valid_until_block: this.validUntilBlock,
      attributes: this.attributes.map((a) => a.toJson()),
      cosigners: this.cosigners.map((c) => c.toJson()),
      script: this.script.toBase64(),
      witnesses: this.witnesses.map((w) => w.toJson()),
    };
  }

  public getScriptHashesForVerifying(): string[] {
    const hashes = this.cosigners.map((cosigner) => cosigner.account);
    if (hashes.indexOf(this.sender) < 0) {
      hashes.unshift(this.sender);
    }
    return hashes.map((h) => h.toBigEndian()).sort();
  }
}

export default Transaction;
