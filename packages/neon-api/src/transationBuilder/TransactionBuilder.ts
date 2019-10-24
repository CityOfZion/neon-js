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
import { reverseHex, Fixed8 } from "@cityofzion/neon-core/lib/u";
import { Account } from "@cityofzion/neon-core/lib/wallet";
import {
  validateValidUntilBlock,
  validateSystemFee,
  validateNetworkFee,
  validateSigning
} from "./validation";

export interface CosignerWithAccount
  extends Pick<CosignerLike, Exclude<keyof CosignerLike, "account">> {
  account: Account;
}

export interface TransactionBuilderConfig {
  sender: Account | string;
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
  private _intents: ScriptIntent[] = [];
  private _transaction: Transaction;

  /**
   * A TransactionBuilder instance can build class with the same network and sender account
   * @param rpc to specify network, can be RPCClient or rpc url
   * @param sender the sender account, can be Account or privateKey
   */
  public constructor(config: TransactionBuilderConfig) {
    const { sender, intents = [], cosigners = [] } = config;
    if (typeof sender === "string") {
      this._sender = new Account(sender);
    } else {
      this._sender = sender;
    }
    this._cosigners = [];
    this._cosignerAccounts = [];
    this._intents = [];

    this._transaction = new Transaction(
      Object.assign(config, {
        sender: reverseHex(this._sender.scriptHash),
        cosigners: this._cosigners
      })
    );
    this.addCosigners(...cosigners);
    this.addIntents(...intents);
  }

  public get transaction() {
    return this._transaction;
  }

  /**
   * Cosigner must sign the transaction to make it valid.
   * Still you could add just an address to build the transaction, and you can export the transaction for cosigner account holder to sign it
   * @param cosigners
   */
  public addCosigners(
    ...cosigners: (CosignerWithAccount | CosignerLike)[]
  ): this {
    const newCosingers: CosignerLike[] = [];
    cosigners.forEach(cosigner => {
      if (typeof cosigner.account !== "string") {
        this._cosignerAccounts.push(cosigner.account);
        newCosingers.push(
          Object.assign({}, cosigner, {
            account: reverseHex(cosigner.account.scriptHash)
          })
        );
      } else {
        this._cosignerAccounts.push(new Account(cosigner.account));
        newCosingers.push(cosigner as CosignerLike);
      }
    });

    this._cosigners.push(...newCosingers);
    this._transaction.addCosigner(...newCosingers);
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

  /**
   * Add an attribute.
   * @param usage The usage type. Do refer to txAttrUsage enum values for all available options.
   * @param data The data as hexstring.
   */
  public addAttribute(usage: number | string, data: string): this {
    this._transaction.addAttribute(new TransactionAttribute({ usage, data }));
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

  public addMultiSig(multisigAccount: Account, ...witnesses: Witness[]) {
    if (!multisigAccount.isMultiSig) {
      throw new Error(`${multisigAccount} is not a multi-sig account`);
    }

    if (
      ![this._sender, ...this._cosignerAccounts].some(
        account => account.address === multisigAccount.address
      )
    ) {
      throw new Error(`${multisigAccount} is neither sender nor cosigner`);
    }

    const multisigWitness = Witness.buildMultiSig(
      this._transaction.serialize(),
      witnesses,
      multisigAccount
    );
    return this.addWitnesses(multisigWitness);
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
      account.privateKey && this._transaction.sign(account);
    });
    return this;
  }

  public setSystemFee(fee: Fixed8) {
    this._transaction.systemFee = fee;
  }

  public setNetworkFee(fee: Fixed8) {
    this._transaction.networkFee = fee;
  }

  public validateValidUntilBlock(
    rpc: RPCClient,
    autoFix = false
  ): Promise<Transaction> {
    return validateValidUntilBlock(this._transaction, rpc, autoFix);
  }

  public validateSystemFee(
    rpc: RPCClient,
    autoFix = false
  ): Promise<Transaction> {
    return validateSystemFee(this._transaction, rpc, autoFix);
  }

  public validateNetworkFee(
    rpc: RPCClient,
    autoFix = false
  ): Promise<Transaction> {
    return validateNetworkFee(this._transaction, rpc, autoFix);
  }

  public validateSigning(): Promise<Transaction> {
    return validateSigning(this._transaction);
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
  public validate(rpc: RPCClient, autoFix = false): Promise<Transaction> {
    return Promise.all([
      this.validateValidUntilBlock(rpc, autoFix),
      this.validateSystemFee(rpc, autoFix),
      this.validateNetworkFee(rpc, autoFix),
      this.validateSigning()
    ]).then(res => this._transaction);
  }

  public async sendTo(rpc: RPCClient): Promise<string> {
    return rpc.sendRawTransaction(this._transaction);
  }
}
