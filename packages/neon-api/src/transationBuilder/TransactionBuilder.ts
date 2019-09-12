import {
  Transaction,
  TransactionAttributeLike,
  WitnessLike,
  TransactionAttribute,
  Witness
} from "@cityofzion/neon-core/lib/tx";
import { RPCClient } from "@cityofzion/neon-core/lib/rpc";
import { ScriptIntent, createScript } from "@cityofzion/neon-core/lib/sc";
import logger from "@cityofzion/neon-core/lib/logging";
import { Fixed8 } from "@cityofzion/neon-core/lib/u";
import { Account } from "@cityofzion/neon-core/lib/wallet";

const log = logger("transactionBuilder");

export interface TransactionBuilderConfig {
  rpc: string | RPCClient;
  intents?: ScriptIntent[];
  sender: Account;
  cosigners?: string[];
  systemFee?: number;
  networkFee?: number;
  validUntilBlock?: number;
  attributes?: TransactionAttributeLike[];
  scripts?: WitnessLike[];
  script?: string;
}

export class TransactionBuilder {
  private _sender: Account;
  private _rpc: RPCClient;
  private _intents: ScriptIntent[];
  private _transaction: Transaction;

  public constructor(config: TransactionBuilderConfig) {
    const { sender, rpc, intents = [], cosigners = [] } = config;
    this._sender = sender;
    if (typeof rpc === "string") {
      this._rpc = new RPCClient(rpc);
    } else {
      this._rpc = rpc;
    }

    this._intents = [];
    this._transaction = new Transaction(
      Object.assign(config, {
        sender: sender.scriptHash
      })
    );
    this.addIntents(...intents);
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

  public addIntents(...intents: ScriptIntent[]) {
    this._transaction.script += createScript(...intents);
    this._intents.push(...intents);
  }

  public addAttributes(...attributes: TransactionAttributeLike[]) {
    this._transaction.attributes.push(
      ...attributes.map(attribute => new TransactionAttribute(attribute))
    );
  }

  public addWitnesses(...witnesses: Witness[]) {
    witnesses.forEach(witness => this._transaction.addWitness(witness));
  }

  public sign() {}

  public async validate(autoFix: boolean = false): Promise<boolean> {
    return Promise.all([
      this.validateValidUntilBlock(autoFix),
      this.validateIntents(),
      this.validateSystemFee(autoFix),
      this.validateNetworkFee(autoFix),
      this.validateSigning()
    ]).then(res => res.reduce((result, value) => result || value));
  }

  public async validateValidUntilBlock(
    autoFix: boolean = false
  ): Promise<boolean> {
    const { validUntilBlock } = this._transaction;
    const height = await this._rpc.getBlockCount();
    if (validUntilBlock <= height) {
      if (autoFix) {
        this._transaction.validUntilBlock =
          Transaction.MAX_TRANSACTION_LIFESPAN + height;
        return true;
      }
      return false;
    } else if (
      validUntilBlock >
      height + Transaction.MAX_TRANSACTION_LIFESPAN
    ) {
      console.warn(
        `Transaction is valid, but it will wait for about ${validUntilBlock -
          height -
          Transaction.MAX_TRANSACTION_LIFESPAN} to be valid to be packed.`
      );
    }
    return true;
  }

  public async validateIntents(): Promise<boolean> {
    return true;
  }

  public async validateSystemFee(autoFix: boolean = false): Promise<boolean> {
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
      return true;
    } else if (requiredSystemFee.isGreaterThan(systemFee)) {
      log.error(
        `Need systemFee at least ${requiredSystemFee}, only ${systemFee} is assigned`
      );
      return false;
    }
    return true;
  }

  public async validateNetworkFee(autoFix: boolean = false): Promise<boolean> {
    return true;
  }

  public async validateSigning(): Promise<boolean> {
    return true;
  }

  public async execute(): Promise<boolean> {
    return this._rpc.sendRawTransaction(this._transaction);
  }
}
