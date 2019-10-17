import {
  Transaction,
  TransactionAttributeLike,
  WitnessLike,
  TransactionAttribute,
  Witness,
  CosignerLike
} from "@cityofzion/neon-core/lib/tx";
import { RPCClient } from "@cityofzion/neon-core/lib/rpc";
import { ScriptIntent, createScript } from "@cityofzion/neon-core/lib/sc";
import logger from "@cityofzion/neon-core/lib/logging";
import { Fixed8, reverseHex } from "@cityofzion/neon-core/lib/u";
import { Account } from "@cityofzion/neon-core/lib/wallet";
import { getNetworkFee, getScriptHashesFromTxWitnesses } from "./util";

const log = logger("transactionBuilder");

export interface CosignerWithAccount
  extends Pick<CosignerLike, Exclude<keyof CosignerLike, "account">> {
  account: Account;
}

export interface TransactionBuilderConfig {
  intents?: ScriptIntent[];
  cosigners?: (CosignerWithAccount | CosignerLike)[];
  systemFee?: number;
  networkFee?: number;
  validUntilBlock?: number;
  attributes?: TransactionAttributeLike[];
  scripts?: WitnessLike[];
  script?: string;
}

/**
 * `TransactionBuilder` is to build a transaction in a more convinient and mature way.
 * It is more powerf
 */
export class TransactionBuilder {
  private _sender: Account;
  /**
   * Cosigners
   */
  private _cosigners: CosignerLike[] = [];
  /**
   * Cosigner accounts that client has access to
   */
  private _cosignerAccounts: Account[] = [];
  private _rpc: RPCClient;
  private _intents: ScriptIntent[] = [];
  private _transaction: Transaction;

  /**
   * A TransactionBuilder instance can build class with the same network and sender account
   * @param rpc to specify network, can be RPCClient or rpc url
   * @param sender the sender account, can be Account or privateKey
   */
  public constructor(rpc: RPCClient | string, sender: Account | string) {
    if (typeof rpc === "string") {
      this._rpc = new RPCClient(rpc);
    } else {
      this._rpc = rpc;
    }

    if (typeof sender === "string") {
      this._sender = new Account(sender);
    } else {
      this._sender = sender;
    }

    this._transaction = new Transaction({
      sender: reverseHex(this._sender.scriptHash)
    });
  }

  /**
   * Load a pack of transaction config info at one time
   * @param config
   */
  public loadFromConfig(config: TransactionBuilderConfig): this {
    const { intents = [], cosigners = [] } = config;
    this._cosigners = [];
    this._cosignerAccounts = [];
    this.addCosigners(...cosigners);

    this._intents = [];
    this._transaction = new Transaction(
      Object.assign(config, {
        sender: reverseHex(this._sender.scriptHash),
        cosigners: this._cosigners
      })
    );
    this.addIntents(...intents);
    return this;
  }

  /**
   * Reset the builder to the initial state, so that it can be used to build a new transaction
   */
  public reset(): this {
    this._cosigners = [];
    this._cosignerAccounts = [];
    this._intents = [];
    this._transaction = new Transaction({
      sender: reverseHex(this._sender.scriptHash)
    });
    return this;
  }

  public get sender() {
    return this._sender;
  }

  public set sender(sender: Account) {
    this._sender = sender;
    this._transaction.sender = sender.scriptHash;
  }

  public get url() {
    return this._rpc.net;
  }

  public set url(url: string) {
    this._rpc.net = url;
  }

  public set rpc(rpc: RPCClient) {
    this._rpc = rpc;
  }

  public get intents() {
    return this._intents;
  }

  /**
   * Cosigner must sign the transaction to make it valid.
   * Still you could add just an address to build the transaction, and you can export the transaction for cosigner account holder to sign it
   * @param cosigners
   */
  public addCosigners(
    ...cosigners: (CosignerWithAccount | CosignerLike)[]
  ): this {
    cosigners.forEach(cosigner => {
      if (typeof cosigner.account !== "string") {
        this._cosignerAccounts.push(cosigner.account);
        this._cosigners.push(
          Object.assign({}, cosigner, {
            account: reverseHex(cosigner.account.scriptHash)
          })
        );
      } else {
        this._cosigners.push(cosigner as CosignerLike);
      }
    });
    return this;
  }

  /**
   * You can add multiple intents to the transaction
   * @param intents
   */
  public addIntents(...intents: ScriptIntent[]): this {
    this._transaction.script += createScript(...intents);
    this._intents.push(...intents);
    return this;
  }

  public addAttributes(...attributes: TransactionAttributeLike[]): this {
    this._transaction.attributes.push(
      ...attributes.map(attribute => new TransactionAttribute(attribute))
    );
    return this;
  }

  /**
   * You can just use `sign` function to do this.
   * Still this is useful when：
   *   1. Need to accept a cosigner's signature
   *   2. Need to use verification trigger of a contract address
   * @param witnesses
   */
  public addWitnesses(...witnesses: Witness[]): this {
    witnesses.forEach(witness => this._transaction.addWitness(witness));
    return this;
  }

  public sign(account: Account | string): this {
    this._transaction.sign(account);
    return this;
  }

  /**
   * The transaction must be signed with sender and all other cosigners.
   * It may be that all signatures cannot be aquired from one client.
   * This function is to sign the transaction with (sender) aquired accounts.
   */
  public signWithAquiredAccounts(): this {
    [this._sender, ...this._cosignerAccounts].forEach(account => {
      this._transaction.sign(account);
    });
    return this;
  }

  /**
   * Validate the transaction and try to fix the invalidation if user agreed.
   * Validations:
   *   1. validUntilBlock prop
   *   2. Intents
   *   3. fee related
   *   4. signature
   * @param autoFix default to be false.
   */
  public async validate(autoFix = false): Promise<this> {
    return Promise.all([
      this.validateValidUntilBlock(autoFix),
      this.validateIntents(),
      this.validateSystemFee(autoFix),
      this.validateNetworkFee(autoFix),
      this.validateSigning()
    ]).then(() => this);
  }

  public async validateValidUntilBlock(autoFix = false): Promise<this> {
    const { validUntilBlock } = this._transaction;
    const height = await this._rpc.getBlockCount();
    if (
      validUntilBlock <= height ||
      validUntilBlock >= height + Transaction.MAX_TRANSACTION_LIFESPAN
    ) {
      if (autoFix) {
        this._transaction.validUntilBlock =
          Transaction.MAX_TRANSACTION_LIFESPAN + height - 1;
        return this;
      }
      return Promise.reject(
        `validUntilBlock prop is not valid: ${validUntilBlock}`
      );
    }
    return this;
  }

  public async validateIntents(): Promise<this> {
    return this;
  }

  public async validateSystemFee(autoFix = false): Promise<this> {
    const { script, systemFee } = this._transaction;
    const { state, gas_consumed } = await this._rpc.invokeScript(script);
    if (state.indexOf("HALT") >= 0) {
      log.info(`transaction script will be excuted successfullyd: ${script}`);
    } else {
      return Promise.reject(
        `transaction script will not be excuted successfullyd: ${script}`
      );
    }

    const requiredSystemFee = new Fixed8(parseFloat(gas_consumed));
    if (autoFix && !requiredSystemFee.equals(systemFee)) {
      log.info(
        `Will change systemFee from ${systemFee} to ${requiredSystemFee}`
      );
      this._transaction.systemFee = systemFee;
      return this;
    } else if (requiredSystemFee.isGreaterThan(systemFee)) {
      const error = `Need systemFee at least ${requiredSystemFee}, only ${systemFee} is assigned`;
      log.error(error);
      return Promise.reject(error);
    } else if (!systemFee.ceil().equals(systemFee)) {
      const error = `SystemFee must be ceiled to integer: ${systemFee}`;
      log.error(error);
      return Promise.reject(error);
    }
    return this;
  }

  public async validateNetworkFee(autoFix = false): Promise<this> {
    const networkFee = getNetworkFee(this._transaction);
    if (autoFix) {
      this._transaction.networkFee = networkFee;
      return this;
    } else if (networkFee.isGreaterThan(this._transaction.networkFee)) {
      const error = `Need networkFee at least ${networkFee}, only ${this._transaction.networkFee} is assigned`;
      log.error(error);
      return Promise.reject(error);
    }
    return this;
  }

  public async validateSigning(): Promise<this> {
    const scriptHashes: string[] = getScriptHashesFromTxWitnesses(
      this._transaction
    );
    const signers = this._transaction
      .getScriptHashesForVerifying()
      .map(hash => reverseHex(hash));
    let notSigned = "";
    if (
      signers.every(signer => {
        if (scriptHashes.indexOf(signer) < 0) {
          notSigned = signer;
          return false;
        }
        return true;
      })
    ) {
      return this;
    }
    return Promise.reject(`Lack signature from ${notSigned}`);
  }

  public exportTransaction(withSignature = false): string {
    return this._transaction.serialize(withSignature);
  }

  public async execute(): Promise<string> {
    return this._rpc.sendRawTransaction(this._transaction);
  }
}
