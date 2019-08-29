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
  deserializeValidUntilBlock,
  getCosignersFromAttributes
} from "./main";
import { ScriptIntent, createScript } from "../../sc";
const log = logger("tx");

export interface TransactionLike {
  version: number;
  nonce: number;
  sender: string;
  systemFee: Fixed8 | number;
  networkFee: Fixed8 | number;
  validUntilBlock: number;
  attributes: TransactionAttributeLike[];
  intents: ScriptIntent[];
  scripts: WitnessLike[];
  script: string;
}

export class Transaction {
  /**
   * Only version=0 is valid for NEO3
   */
  public version: number;
  /**
   * A random 4-byte number to avoid hash collision, range [0, 2**32)
   */
  public nonce: number;
  /**
   * transation invoker in script hash
   */
  public sender: string;

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
   * System Fee calculated while adding intents
   */
  private _pre_systemFee: Fixed8;

  /**
   * Current transaction will be invalid after block of height validUntilBlock
   */
  public validUntilBlock: number;
  public attributes: TransactionAttribute[];
  public intents: ScriptIntent[];
  public scripts: Witness[];
  public script: string;

  /**
   * @description Maximum duration in blocks that a transaction can stay valid in the mempol
   */
  public static MAX_TRANSACTION_LIFESPAN = 2102400;

  public constructor(tx: Partial<TransactionLike> = {}) {
    const {
      version,
      nonce,
      sender,
      systemFee,
      networkFee,
      validUntilBlock,
      attributes,
      intents,
      scripts,
      script
    } = tx;
    this.version = version || TX_VERSION;
    this.nonce = nonce || parseInt(ab2hexstring(generateRandomArray(4)), 16);
    this.sender = formatSender(sender);
    this.validUntilBlock = validUntilBlock || 0;
    this.attributes = Array.isArray(attributes)
      ? attributes.map(a => new TransactionAttribute(a))
      : [];
    this.scripts = Array.isArray(scripts)
      ? scripts.map(a => new Witness(a))
      : [];
    this.scripts = this.scripts.sort(
      (w1, w2) => parseInt(w1.scriptHash, 16) - parseInt(w2.scriptHash, 16)
    );
    this.systemFee = systemFee ? new Fixed8(systemFee) : new Fixed8(0);
    this.networkFee = networkFee ? new Fixed8(networkFee) : new Fixed8(0);
    this._pre_systemFee = new Fixed8(0);
    this.script = script || "";
    if (intents !== undefined) {
      this.intents = intents;
      this.addIntents(...intents);
    } else {
      this.intents = [];
    }
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
    const cloneWitness = new Witness({
      invocationScript: witness.invocationScript,
      verificationScript: witness.verificationScript
    });
    if (!cloneWitness.verificationScript) {
      cloneWitness.scriptHash = witness.scriptHash;
    }

    this.scripts.push(cloneWitness);
    this.scripts = this.scripts.sort(
      (w1, w2) => parseInt(w1.scriptHash, 16) - parseInt(w2.scriptHash, 16)
    );
    return this;
  }

  /**
   * Adds some script intents to the Transaction
   * System Fee will be increased automatically (currently deprecated)
   * However system Fee calculated in this method is insufficient if calling non-native contracts.
   * If the transaction is invoking contracts other than native contracts, invokeScript rpc request can test the systemFee.
   * @param scriptIntents sciprt Intents to add to the transaction
   */
  public addIntents(...scriptIntents: ScriptIntent[]): this {
    let increasedSystemFee = new Fixed8(0);
    this.script = scriptIntents.reduce((accumulatedScript, intent) => {
      const script = createScript(intent);
      // TODO: add fee calculation here.
      // this._pre_systemFee = this._pre_systemFee.plus(fee);
      // increasedSystemFee = increasedSystemFee.plus(fee);
      this.intents.push(intent);
      return accumulatedScript + script;
    }, this.script);
    log.info(
      `Increased systemFee: ${increasedSystemFee.toNumber()}, totally ${this.systemFee.toNumber()}`
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
    out += num2hexstring(this.nonce, 4);
    out += this.sender;
    out += this.systemFee.toReverseHex();
    out += this.networkFee.toReverseHex();
    out += num2hexstring(this.validUntilBlock, 4);
    out += serializeArrayOf(this.attributes);
    out += num2VarInt(this.script.length / 2);
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
      intents: this.intents,
      scripts: this.scripts.map(a => a.export()),
      script: this.script
    };
  }

  public getScriptHashesForVerifying(): string[] {
    let hashes = getCosignersFromAttributes(this.attributes);
    hashes.unshift(this.sender);
    return hashes.sort();
  }
}

export default Transaction;
