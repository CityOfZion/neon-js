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
  deserializeVersion,
  deserializeScript,
  deserializeFee,
  deserializeAttributes,
  deserializeWitnesses,
  formatSender,
  deserializeNonce,
  deserializeSender,
  deserializeValidUntilBlock,
  deserializeCosigners
} from "./main";
import { CosignerLike, Cosigner } from "../components/Cosigner";
import { serializeArrayOf } from "../lib";
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
   * transation invoker in script hash in big endian
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
   * Current transaction will be invalid after block of height validUntilBlock
   */
  public validUntilBlock: number;
  public attributes: TransactionAttribute[];
  public cosigners: Cosigner[];
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
      cosigners = [],
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
    this.cosigners = [];
    this.addCosigner(...cosigners);
    this.systemFee = systemFee ? new Fixed8(systemFee) : new Fixed8(0);
    this.networkFee = networkFee ? new Fixed8(networkFee) : new Fixed8(0);
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

  public addCosigner(...cosigners: CosignerLike[]): this {
    const cosignerHashes = this.cosigners.map(cosigner => cosigner.account);
    this.cosigners.push(
      ...cosigners.map(cosigner => {
        const hash = cosigner.account;
        if (cosignerHashes.indexOf(hash) >= 0) {
          throw new Error(`Cannot add duplicate cosigner: ${hash}`);
        }
        cosignerHashes.push(hash);
        return new Cosigner(cosigner);
      })
    );
    return this;
  }

  public addAttribute(...attributes: Array<TransactionAttribute>) {
    this.attributes.push(...attributes);
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
   * Serialize the transaction and return it as a hexstring.
   * @param {boolean} signed  - Whether to serialize the signatures. Signing requires it to be serialized without the signatures.
   * @return {string} Hexstring.
   */
  public serialize(signed = true): string {
    if (this.version !== 0) {
      throw new Error(`Version must be 0`);
    }
    ensureHex(this.sender);
    let out = "";
    out += num2hexstring(this.version);
    out += num2hexstring(this.nonce, 4, true);
    out += this.sender;
    out += this.systemFee.toReverseHex();
    out += this.networkFee.toReverseHex();
    out += num2hexstring(this.validUntilBlock, 4, true);
    out += serializeArrayOf(this.attributes);
    out += serializeArrayOf(this.cosigners);
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
      cosigners: this.cosigners.map(cosigner => cosigner.export()),
      scripts: this.scripts.map(a => a.export()),
      script: this.script
    };
  }

  public getScriptHashesForVerifying(): string[] {
    const hashes = this.cosigners.map(cosigner => cosigner.account);
<<<<<<< HEAD
    if (
      !hashes.every(hash => hashes.indexOf(hash) === hashes.lastIndexOf(hash))
    ) {
      throw new Error(`Duplicate Cosigner`);
    }
=======
>>>>>>> origin/next
    if (hashes.indexOf(this.sender) < 0) {
      hashes.unshift(this.sender);
    }
    return hashes.sort();
  }
}

export default Transaction;
