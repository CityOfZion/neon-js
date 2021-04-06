import { TX_VERSION, MAGIC_NUMBER } from "../../consts";
import logger from "../../logging";
import {
  sha256,
  num2hexstring,
  reverseHex,
  StringStream,
  num2VarInt,
  generateRandomArray,
  ab2hexstring,
  HexString,
  BigInteger,
  serializeArrayOf,
} from "../../u";
import { Account, sign, getAddressFromScriptHash } from "../../wallet";
import {
  TransactionAttribute,
  TransactionAttributeLike,
  Witness,
  WitnessLike,
  TransactionAttributeJson,
  WitnessJson,
  SignerLike,
  Signer,
  SignerJson,
} from "../components";
import {
  deserializeVersion,
  deserializeScript,
  deserializeFee,
  deserializeAttributes,
  deserializeWitnesses,
  deserializeNonce,
  deserializeValidUntilBlock,
  deserializeSigners,
} from "./main";
import { NeonObject } from "../../model";
const log = logger("tx");

export interface TransactionLike {
  version: number;
  nonce: number;
  systemFee: BigInteger | string | number;
  networkFee: BigInteger | string | number;
  validUntilBlock: number;
  signers: SignerLike[];
  attributes: TransactionAttributeLike[];
  witnesses: WitnessLike[];
  script: string;
}

export interface TransactionJson {
  hash?: string;
  size: number;
  version: number;
  nonce: number;
  sender: string;
  sysfee: string;
  netfee: string;
  validuntilblock: number;
  signers: SignerJson[];
  attributes: TransactionAttributeJson[];
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
  public get sender(): HexString {
    return this.signers && this.signers.length > 0
      ? this.signers[0].account
      : HexString.fromHex("");
  }

  /**
   * systemFee is calculated by summarizing prices of all the opcodes and interopServices used while executing transaction script in vm.
   *
   * @remarks
   * The most reliable way to calculate minimum systemFee is to use invokeScript method to test, as it's hard to know what the contract will do.
   * If transaction only invokes native contracts, systemFee can be calculated offline. It is distributed to NEO holders.
   *
   * @example
   * const systemFee = SUM(OpCodePrices + InteropServiceCodePrices)
   */
  public systemFee: BigInteger;

  /**
   * networkFee is calculated according to transaction size and verificationScript cost in witnesses.
   *
   * @remarks
   * First part of networkFee is counted by transaction size by unit price `FeePerByte`
   * `verificationScriptCost` is calculated by summing up opcodes and interopService prices, like `systemFee`; contract verificationScript may need to be run in the VM to get the exact price.
   * It is distributed to consensus nodes.
   *
   * @example
   * const networkFee = FeePerByte * txSize + SUM(verificationScriptCost)
   *
   */
  public networkFee: BigInteger;

  /**
   * Current transaction will be invalid after block of height validUntilBlock
   */
  public validUntilBlock: number;
  public attributes: TransactionAttribute[];
  public signers: Signer[];
  public witnesses: Witness[];
  public script: HexString;

  /**
   * Maximum duration in blocks that a transaction can stay valid in the mempool.
   * This is 24 hours based on 15s blocktime.
   */
  public static MAX_TRANSACTION_LIFESPAN = 5760;

  public static fromJson(input: TransactionJson): Transaction {
    return new Transaction({
      version: input.version,
      nonce: input.nonce,
      systemFee: BigInteger.fromDecimal(input.sysfee, 0),
      networkFee: BigInteger.fromDecimal(input.netfee, 0),
      validUntilBlock: input.validuntilblock,
      attributes: input.attributes.map((a) => TransactionAttribute.fromJson(a)),
      signers: input.signers.map((c) => Signer.fromJson(c)),
      script: HexString.fromBase64(input.script),
      witnesses: input.witnesses.map((w) => Witness.fromJson(w)),
    });
  }

  public constructor(
    tx: Partial<Pick<TransactionLike | Transaction, keyof TransactionLike>> = {}
  ) {
    const {
      version,
      nonce,
      systemFee,
      networkFee,
      validUntilBlock,
      attributes,
      signers = [],
      witnesses,
      script,
    } = tx;
    this.version = version ?? TX_VERSION;
    this.nonce = nonce ?? parseInt(ab2hexstring(generateRandomArray(4)), 16);
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
    this.signers = [];
    signers.forEach((s) => this.addSigner(s));
    this.systemFee =
      systemFee instanceof BigInteger
        ? systemFee
        : BigInteger.fromNumber(systemFee ?? 0);
    this.networkFee =
      networkFee instanceof BigInteger
        ? networkFee
        : BigInteger.fromNumber(networkFee ?? 0);
    this.script = HexString.fromHex(script ?? "");
  }

  public get [Symbol.toStringTag](): string {
    return "Transaction";
  }
  /**
   * Transaction hash.
   */
  public hash(): string {
    return reverseHex(sha256(this.serialize(false)));
  }

  public get size(): number {
    return (
      this.headerSize +
      num2VarInt(this.attributes.length).length / 2 +
      this.attributes.reduce((sum, a) => sum + a.size, 0) +
      num2VarInt(this.signers.length).length / 2 +
      this.signers.reduce((sum, c) => sum + c.size, 0) +
      num2VarInt(this.script.byteLength).length / 2 +
      this.script.byteLength +
      num2VarInt(this.witnesses.length).length / 2 +
      this.witnesses.reduce((sum, w) => sum + w.size, 0)
    );
  }

  /**
   * Returns the fees as a integer string.
   * Divide this by 100000000 to get the decimal value.
   */
  public get fees(): string {
    return this.systemFee.add(this.networkFee).toString();
  }

  /**
   * Transaction header size
   */
  public get headerSize(): number {
    return (
      /* version */ 1 +
      /* nonce */ 4 +
      /* systemFee */ 8 +
      /* networkFee */ 8 +
      /* validUntilBlock */ 4
    );
  }

  /**
   * Deserializes a hexstring into a Transaction object.
   * @param hexstring - hexstring of the transaction.
   */
  public static deserialize(hex: string): Transaction {
    const ss = new StringStream(hex);
    let txObj = deserializeVersion(ss);
    txObj = deserializeNonce(ss, txObj);
    txObj = deserializeFee(ss, txObj);
    txObj = deserializeValidUntilBlock(ss, txObj);
    txObj = deserializeSigners(ss, txObj);
    txObj = deserializeAttributes(ss, txObj);
    txObj = deserializeScript(ss, txObj);
    if (!ss.isEmpty()) {
      txObj = deserializeWitnesses(ss, txObj);
    }
    return new Transaction(txObj);
  }

  public addSigner(newSigner: SignerLike | Signer): this {
    const acctHashes = this.signers.map((signer) => signer.account);
    const newHash = HexString.fromHex(newSigner.account);
    if (acctHashes.find((hash) => hash.equals(newHash))) {
      throw new Error(`Cannot add duplicate cosigner: ${newSigner.account}`);
    }
    this.signers.push(new Signer(newSigner));
    return this;
  }

  public addAttribute(attr: TransactionAttributeLike): this {
    this.attributes.push(new TransactionAttribute(attr));
    return this;
  }

  /**
   * Adds Witness to the Transaction and automatically sorts the witnesses according to scripthash.
   * @param obj - Witness object to add as witness
   */
  public addWitness(obj: WitnessLike | Witness): this {
    this.witnesses.push(new Witness(obj));
    this.witnesses = this.witnesses.sort(
      (w1, w2) => parseInt(w1.scriptHash, 16) - parseInt(w2.scriptHash, 16)
    );
    return this;
  }

  /**
   * Serialize the transaction and return it as a hexstring.
   * @param signed - whether to serialize the signatures. Signing requires it to be serialized without the signatures.
   */
  public serialize(signed = true): string {
    if (this.version !== 0) {
      throw new Error(`Version must be 0`);
    }
    let out = "";
    out += num2hexstring(this.version);
    out += num2hexstring(this.nonce, 4, true);
    out += this.systemFee.toReverseHex().padEnd(16, "0");
    out += this.networkFee.toReverseHex().padEnd(16, "0");
    out += num2hexstring(this.validUntilBlock, 4, true);
    out += serializeArrayOf(this.signers);
    out += serializeArrayOf(this.attributes);
    out += num2VarInt(this.script.byteLength);
    out += this.script.toString();
    if (signed) {
      out += serializeArrayOf(this.witnesses);
    }
    return out;
  }

  /**
   * Signs a transaction.
   * @param signingKey - Account, privateKey or WIF
   * @param networkMagic - Magic number of network found in protocol.json.
   * @param k - optional nonce for signature generation. Setting this causes the signature to be deterministic.
   */
  public sign(
    signingKey: Account | string,
    networkMagic: number = MAGIC_NUMBER.MainNet,
    k?: string | number
  ): this {
    if (typeof signingKey === "string") {
      signingKey = new Account(signingKey);
    }
    const signature = sign(
      num2hexstring(networkMagic, 4, true) + reverseHex(this.hash()),
      signingKey.privateKey,
      k
    );
    log.info(`Signed Transaction with Account: ${signingKey.label}`);
    this.addWitness(Witness.fromSignature(signature, signingKey.publicKey));
    return this;
  }

  /**
   * Hexstring of transaction for signing.
   * @param networkMagic - magic number of network found in protocol.json.
   */
  public getMessageForSigning(networkMagic: number): string {
    return num2hexstring(networkMagic, 4, true) + reverseHex(this.hash());
  }

  public equals(other: Partial<TransactionLike | Transaction>): boolean {
    if (other instanceof Transaction) {
      return this.hash() === other.hash();
    }
    return this.hash() === new Transaction(other).hash();
  }

  public export(): TransactionLike {
    return {
      version: this.version,
      nonce: this.nonce,
      systemFee: this.systemFee.toString(),
      networkFee: this.networkFee.toString(),
      validUntilBlock: this.validUntilBlock,
      attributes: this.attributes.map((a) => a.export()),
      signers: this.signers.map((s) => s.export()),
      witnesses: this.witnesses.map((a) => a.export()),
      script: this.script.toBigEndian(),
    };
  }

  public toJson(): TransactionJson {
    return {
      size: this.size,
      version: this.version,
      nonce: this.nonce,
      sender:
        this.sender.byteLength === 0
          ? ""
          : getAddressFromScriptHash(this.sender.toBigEndian()),
      sysfee: this.systemFee.toDecimal(0),
      netfee: this.networkFee.toDecimal(0),
      validuntilblock: this.validUntilBlock,
      attributes: this.attributes.map((a) => a.toJson()),
      signers: this.signers.map((c) => c.toJson()),
      script: this.script.toBase64(),
      witnesses: this.witnesses.map((w) => w.toJson()),
    };
  }

  public getScriptHashesForVerifying(): string[] {
    return this.signers.map((s) => s.account.toBigEndian());
  }
}

export default Transaction;
