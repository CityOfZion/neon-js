import {
  Transaction,
  TransactionAttributeLike,
  WitnessLike,
  TransactionAttribute,
  Witness,
  CosignerLike
} from "@cityofzion/neon-core/lib/tx";
import { RPCClient } from "@cityofzion/neon-core/lib/rpc";
import {
  ScriptIntent,
  createScript,
  OpCodePrices,
  OpCode,
  getInteropServicePrice,
  InteropServiceCode,
  ScriptBuilder
} from "@cityofzion/neon-core/lib/sc";
import logger from "@cityofzion/neon-core/lib/logging";
import { Fixed8, reverseHex } from "@cityofzion/neon-core/lib/u";
import {
  Account,
  getSigningThresholdFromVerificationScript,
  getPublicKeysFromVerificationScript,
  verify,
  getScriptHashFromPublicKey
} from "@cityofzion/neon-core/lib/wallet";
import { POLICY_FEE_PERBYTE } from "@cityofzion/neon-core/lib/consts";

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

export class TransactionBuilder {
  private _sender: Account;
  private _cosigners: CosignerLike[] = [];
  private _cosignerAccounts: Account[] = [];
  private _rpc: RPCClient;
  private _intents: ScriptIntent[] = [];
  private _transaction: Transaction;

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

  public addWitnesses(...witnesses: Witness[]): this {
    witnesses.forEach(witness => this._transaction.addWitness(witness));
    return this;
  }

  public sign(account: Account | string): this {
    this._transaction.sign(account);
    return this;
  }

  public signWithAquiredAccounts(): this {
    [this._sender, ...this._cosignerAccounts].forEach(account => {
      this._transaction.sign(account);
    });
    return this;
  }

  public async validate(autoFix = false): Promise<boolean> {
    return Promise.all([
      this.validateValidUntilBlock(autoFix),
      this.validateIntents(),
      this.validateSystemFee(autoFix),
      this.validateNetworkFee(autoFix),
      this.validateSigning()
    ]).then(res => res.reduce((result, value) => result || value));
  }

  public async validateValidUntilBlock(autoFix = false): Promise<boolean> {
    const { validUntilBlock } = this._transaction;
    const height = await this._rpc.getBlockCount();
    if (validUntilBlock <= height) {
      if (autoFix) {
        this._transaction.validUntilBlock =
          Transaction.MAX_TRANSACTION_LIFESPAN + height - 1;
        return true;
      }
      return false;
    } else if (
      validUntilBlock >=
      height + Transaction.MAX_TRANSACTION_LIFESPAN
    ) {
      console.warn(
        `Transaction is valid, but it will wait for about ${validUntilBlock -
          height -
          Transaction.MAX_TRANSACTION_LIFESPAN} blocks to be valid to be packed.`
      );
    }
    return true;
  }

  public async validateIntents(): Promise<boolean> {
    return true;
  }

  public async validateSystemFee(autoFix = false): Promise<boolean> {
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
    } else if (!systemFee.ceil().equals(systemFee)) {
      log.error(`SystemFee must be ceiled to integer: ${systemFee}`);
      return false;
    }
    return true;
  }

  public async validateNetworkFee(autoFix = false): Promise<boolean> {
    const networkFee = new Fixed8(0);
    try {
      const signers = this._transaction.getScriptHashesForVerifying();
      signers.forEach(signer => {
        const account = new Account(signer);
        if (!account.isMultiSig) {
          networkFee.add(this._getNetworkFeeForSig());
        } else {
          const n = getPublicKeysFromVerificationScript(account.contract.script)
            .length;
          const m = getSigningThresholdFromVerificationScript(
            account.contract.script
          );
          networkFee.add(this._getNetworkFeeForMultiSig(m, n));
        }
        // TODO: consider about contract verfication script
      });

      const size = this._transaction.serialize(true).length / 2;
      networkFee.add(new Fixed8(size).multipliedBy(POLICY_FEE_PERBYTE));
    } catch (err) {
      return Promise.reject(err);
    }

    if (autoFix) {
      this._transaction.networkFee = networkFee;
      return true;
    } else if (networkFee.isGreaterThan(this._transaction.networkFee)) {
      log.error(
        `Need networkFee at least ${networkFee}, only ${this._transaction.networkFee} is assigned`
      );
      return false;
    }

    return true;
  }

  private _getNetworkFeeForSig(): number {
    return (
      OpCodePrices[OpCode.PUSHBYTES64] +
      OpCodePrices[OpCode.PUSHBYTES33] +
      getInteropServicePrice(InteropServiceCode.NEO_CRYPTO_CHECKSIG)
    );
  }

  private _getNetworkFeeForMultiSig(
    signingThreshold: number,
    pubkeysNum: number
  ): number {
    const sb = new ScriptBuilder();
    return (
      OpCodePrices[OpCode.PUSHBYTES64] * signingThreshold +
      OpCodePrices[sb.emitPush(signingThreshold).str.slice(0, 2) as OpCode] +
      OpCodePrices[OpCode.PUSHBYTES33] * pubkeysNum +
      OpCodePrices[sb.emitPush(pubkeysNum).str.slice(0, 2) as OpCode] +
      getInteropServicePrice(InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG, {
        size: pubkeysNum
      })
    );
  }

  public async useBestValidUntilBlock(): Promise<this> {
    this._transaction.validUntilBlock =
      Transaction.MAX_TRANSACTION_LIFESPAN +
      (await this.rpc.getBlockCount()) -
      1;
    return this;
  }

  public async validateSigning(): Promise<boolean> {
    const scriptHashes: string[] = [];
    this._transaction.scripts.forEach(script =>
      scriptHashes.push(
        ...getPublicKeysFromVerificationScript(script.verificationScript).map(
          publicKey => getScriptHashFromPublicKey(publicKey)
        )
      )
    );
    const signers = this._transaction
      .getScriptHashesForVerifying()
      .map(hash => reverseHex(hash));
    return signers.every(signer => scriptHashes.indexOf(signer) >= 0);
  }

  public async execute(): Promise<string> {
    return this._rpc.sendRawTransaction(this._transaction);
  }
}
