import {
  TX_VERSION,
  POLICY_FEE_PERBYTE,
  SYSTEM_FEE_FREE,
  SYSTEM_FEE_FACTOR
} from "../../consts";
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
import {
  Account,
  sign,
  getPublicKeysFromVerificationScript,
  getSigningThresholdFromVerificationScript
} from "../../wallet";
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
  getCosignersFromAttributes,
  getVarSize,
  getNetworkFeeForSig,
  getNetworkFeeForMultiSig,
  getSizeForSig,
  getSizeForMultiSig
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

  public static MAX_VALIDUNTILBLOCK_INCREMENT = 2102400;

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
    // TODO: The default should be snapshot.height + MAX_VALIDUNTILBLOCK_INCREMENT, but it needs request to get block height, thus this is a temporary value
    this.validUntilBlock =
      validUntilBlock || Transaction.MAX_VALIDUNTILBLOCK_INCREMENT;
    this.attributes = Array.isArray(attributes)
      ? attributes.map(a => new TransactionAttribute(a))
      : [];
    this.scripts = Array.isArray(scripts)
      ? scripts.map(a => new Witness(a))
      : [];
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
    this.scripts.push(witness);
    this.scripts = this.scripts.sort(
      (w1, w2) => parseInt(w1.scriptHash, 16) - parseInt(w2.scriptHash, 16)
    );
    return this;
  }

  /**
   * Adds some script intents to the Transaction
   * System Fee will be increased automatically
   * However system Fee calculated in this method is insufficient if calling non-native contracts.
   * If the transaction is invoking contracts other than native contracts, invokeScript rpc request can test the systemFee.
   * @param scriptIntents sciprt Intents to add to the transaction
   */
  public addIntents(...scriptIntents: ScriptIntent[]): this {
    let increasedSystemFee = new Fixed8(0);
    this.script = scriptIntents.reduce((accumulatedScript, intent) => {
      const { hex, fee } = createScript(intent);
      this._pre_systemFee = this._pre_systemFee.plus(fee);
      increasedSystemFee = increasedSystemFee.plus(fee);
      this.intents.push(intent);
      return accumulatedScript + hex;
    }, this.script);
    log.info(
      `Increased systemFee: ${increasedSystemFee.toNumber()}, totally ${this.systemFee.toNumber()}`
    );
    return this;
  }

  /**
   * If transaction script is constructed only by method `addIntent`, systemFee will be calcuated.
   * If all intents are about native contract invocation, this system fee is accurate.
   * In this case, you can use this method to get minimum system fee.
   */
  public useCalculatedSystemFee(): void {
    this.systemFee = this._pre_systemFee;
  }

  /**
   * This function regulate system fee in 2 processes:
   * 1. minus the free system fee amount
   * 2. systemFee must be multiples of `SYSTEM_FEE_FACTOR`; if not, ceil it.
   */
  public regulateSystemFee(): void {
    let systemFee = this.systemFee.minus(SYSTEM_FEE_FREE);
    systemFee = systemFee.comparedTo(0) >= 0 ? systemFee : new Fixed8(0);
    if (systemFee.comparedTo(0) > 0) {
      const remainder = systemFee.mod(SYSTEM_FEE_FACTOR);
      if (remainder.comparedTo(0) > 0) {
        this.systemFee = systemFee.plus(
          new Fixed8(SYSTEM_FEE_FACTOR).minus(remainder)
        );
      } else {
        this.systemFee = systemFee;
      }
    } else {
      this.systemFee = new Fixed8(0);
    }
  }

  /**
   * calculate networkFee
   * networkFee = verificationCost + txSize * POLICY_FEE_PERBYTE
   * @param autoAjust when true, auto justify tx networkfee to the minimum value
   * @returns minimum networkFee that this tx needs
   */
  public calculateNetworkFee(autoAdjust: boolean = true): Fixed8 {
    let networkFee = new Fixed8(0);

    const signers = this.getScriptHashesForVerifying();

    let size =
      this.headerSize +
      serializeArrayOf(this.attributes).length / 2 +
      this.script.length / 2 +
      getVarSize(signers.length);

    signers.forEach(signer => {
      const account = new Account(signer);
      if (!account.isMultiSig) {
        size += getSizeForSig(signer);
        networkFee = networkFee.add(getNetworkFeeForSig());
      } else {
        const n = getPublicKeysFromVerificationScript(account.contract.script)
          .length;
        const m = getSigningThresholdFromVerificationScript(
          account.contract.script
        );
        size += getSizeForMultiSig(signer, m);
        networkFee = networkFee.add(getNetworkFeeForMultiSig(m, n));
      }
    });
    networkFee = networkFee.add(size * POLICY_FEE_PERBYTE);

    if (autoAdjust) {
      this.networkFee = networkFee;
    }

    return networkFee;
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
