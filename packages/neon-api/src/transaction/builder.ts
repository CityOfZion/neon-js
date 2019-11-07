import { tx, sc, u } from "@cityofzion/neon-core";

export class TransactionBuilder {
  private _config: Partial<tx.TransactionLike>;

  public constructor(config: Partial<tx.TransactionLike>) {
    this._config = config;
  }

  /**
   * Add cosigners
   * @param cosigners
   */
  public addCosigners(...cosigners: tx.CosignerLike[]): this {
    this._config.cosigners = [...(this._config.cosigners || []), ...cosigners];
    return this;
  }

  /**
   * You can add multiple intents to the transaction
   * @param intents
   */
  public addIntents(...intents: sc.ScriptIntent[]): this {
    this._config.script =
      this._config.script || "" + sc.createScript(...intents);
    return this;
  }

  /**
   * Add an attribute.
   * @param usage The usage type. Do refer to txAttrUsage enum values for all available options.
   * @param data The data as hexstring.
   */
  public addAttribute(usage: number | string, data: string): this {
    this._config.attributes = [
      ...(this._config.attributes || []),
      {
        usage,
        data
      }
    ];
    return this;
  }

  public setSystemFee(fee: u.Fixed8) {
    this._config.systemFee = fee;
    return this;
  }

  public setNetworkFee(fee: u.Fixed8) {
    this._config.networkFee = fee;
    return this;
  }

  public build(): tx.Transaction {
    return new tx.Transaction(this._config);
  }
}
