import { tx, rpc, u, sc } from "@cityofzion/neon-core";
import { getNetworkFee, getScriptHashesFromTxWitnesses } from "./util";

export enum ValidationAttributes {
  None = 0,
  ValidUntilBlock = 1 << 0,
  SystemFee = 1 << 1,
  NetworkFee = 1 << 2,
  Intents = 1 << 3
}

export interface ValidationSuggestion<T> {
  /**
   * Whether this is auto-fixed by validator
   * Validator will try to fix the transaction when param `autoFix` is set to TRUE
   */
  fixed: boolean;
  prev: T;
  suggestion: T;
}

export interface ValidationResult {
  /**
   * Whether the transaction is valid after validation
   */
  valid: boolean;
  suggestions?: {
    validaUntilBlock?: ValidationSuggestion<number>;
    intents?: Array<string>;
    systemFee?: ValidationSuggestion<u.Fixed8>;
    networkFee?: ValidationSuggestion<u.Fixed8>;
  };
}

/**
 * A class with functions to validate transaction
 */
export class TransactionValidator {
  /**
   * Transaction will be validated on this rpc node
   */
  public rpcClient: rpc.RPCClient;

  /**
   * Transaction that will be validated
   */
  public transaction: tx.Transaction;

  constructor(rpc: rpc.RPCClient, transaction: tx.Transaction) {
    this.rpcClient = rpc;
    this.transaction = transaction;
  }

  /**
   * validate transaction attribute - validUntilBlock
   * @param autoFix will automatically fix transaction if specified as true
   */
  async validateValidUntilBlock(autoFix = false): Promise<ValidationResult> {
    const { validUntilBlock } = this.transaction;
    const height = await this.rpcClient.getBlockCount();
    if (
      validUntilBlock <= height ||
      validUntilBlock >= height + tx.Transaction.MAX_TRANSACTION_LIFESPAN
    ) {
      const vub_suggestion =
        tx.Transaction.MAX_TRANSACTION_LIFESPAN + height - 1;
      if (autoFix) {
        this.transaction.validUntilBlock = vub_suggestion;
        return {
          valid: true,
          suggestions: {
            validaUntilBlock: {
              fixed: true,
              prev: validUntilBlock,
              suggestion: vub_suggestion
            }
          }
        };
      }
      return {
        valid: false,
        suggestions: {
          validaUntilBlock: {
            fixed: false,
            prev: validUntilBlock,
            suggestion: vub_suggestion
          }
        }
      };
    }
    return {
      valid: true
    };
  }

  private async _validateIntent(
    intent: sc.ScriptIntent
  ): Promise<string | undefined> {
    const { scriptHash, operation } = intent;
    const manifest = await this.rpcClient.getContractState(scriptHash);
    if (manifest === null) {
      return `Unknow contract ${scriptHash}`;
    }

    if (operation) {
      if (
        manifest.abi.methods.map(method => method.name).indexOf(operation) < 0
      ) {
        return `Unknow method ${operation} for constract ${scriptHash}`;
      }
    }

    return undefined;
  }

  /**
   * Validate intents
   */
  async validateIntents(): Promise<ValidationResult> {
    const intents = new sc.ScriptParser(
      this.transaction.script
    ).toScriptParams();
    const intentsRes: Array<string> = [];
    await Promise.all(
      intents.map(intent =>
        this._validateIntent(intent).then(res =>
          res ? intentsRes.push(res) : res
        )
      )
    );
    if (intentsRes.length > 0) {
      return {
        valid: false,
        suggestions: {
          intents: intentsRes
        }
      };
    } else {
      return {
        valid: true
      };
    }
  }

  /**
   * validate systemFee
   * @param autoFix will automatically fix transaction if specified as true
   */
  async validateSystemFee(autoFix = false): Promise<ValidationResult> {
    const validateIntentsResult = await this.validateIntents();
    if (!validateIntentsResult.valid) {
      return validateIntentsResult;
    }

    const { script, systemFee } = this.transaction;
    const { gas_consumed } = await this.rpcClient.invokeScript(script);
    const minimumSystemFee = new u.Fixed8(parseFloat(gas_consumed)).ceil();
    if (autoFix && !minimumSystemFee.equals(systemFee)) {
      this.transaction.systemFee = minimumSystemFee;
      return {
        valid: true,
        suggestions: {
          systemFee: {
            fixed: true,
            prev: systemFee,
            suggestion: minimumSystemFee
          }
        }
      };
    } else if (
      minimumSystemFee.isGreaterThan(systemFee) ||
      !systemFee.isEqualTo(systemFee.ceil())
    ) {
      return {
        valid: false,
        suggestions: {
          systemFee: {
            fixed: false,
            prev: systemFee,
            suggestion: minimumSystemFee
          }
        }
      };
    }
    return {
      valid: true
    };
  }

  /**
   * Validate NetworkFee
   * @param autoFix will automatically fix transaction if specified as true
   */
  async validateNetworkFee(autoFix = false): Promise<ValidationResult> {
    const { networkFee } = this.transaction;
    const minimumNetworkFee = getNetworkFee(this.transaction);
    if (autoFix && !minimumNetworkFee.equals(networkFee)) {
      this.transaction.networkFee = minimumNetworkFee;
      return {
        valid: true,
        suggestions: {
          networkFee: {
            fixed: true,
            prev: networkFee,
            suggestion: minimumNetworkFee
          }
        }
      };
    } else if (minimumNetworkFee.isGreaterThan(networkFee)) {
      return {
        valid: false,
        suggestions: {
          networkFee: {
            fixed: false,
            prev: networkFee,
            suggestion: minimumNetworkFee
          }
        }
      };
    }
    return {
      valid: true
    };
  }

  async validate(
    attrs: ValidationAttributes,
    autoFix: ValidationAttributes | boolean
  ): Promise<ValidationResult> {
    const validationTasks: Array<Promise<ValidationResult>> = [];
    if (attrs & ValidationAttributes.ValidUntilBlock) {
      if (typeof autoFix === "boolean") {
        validationTasks.push(this.validateValidUntilBlock(autoFix));
      } else {
        validationTasks.push(
          this.validateValidUntilBlock(
            Boolean(autoFix & ValidationAttributes.ValidUntilBlock)
          )
        );
      }
    }

    if (attrs & ValidationAttributes.SystemFee) {
      if (typeof autoFix === "boolean") {
        validationTasks.push(this.validateSystemFee(autoFix));
      } else {
        validationTasks.push(
          this.validateSystemFee(
            Boolean(autoFix & ValidationAttributes.SystemFee)
          )
        );
      }
    }

    if (attrs & ValidationAttributes.NetworkFee) {
      if (typeof autoFix === "boolean") {
        validationTasks.push(this.validateNetworkFee(autoFix));
      } else {
        validationTasks.push(
          this.validateNetworkFee(
            Boolean(autoFix & ValidationAttributes.NetworkFee)
          )
        );
      }
    }

    if (
      !(attrs & ValidationAttributes.SystemFee) &&
      attrs & ValidationAttributes.Intents
    ) {
      validationTasks.push(this.validateIntents());
    }

    return Promise.all(validationTasks).then(res =>
      res.reduce((prev, cur) => {
        return {
          valid: prev.valid && cur.valid,
          suggestions: {
            ...prev.suggestions,
            ...cur.suggestions
          }
        };
      })
    );
  }
}
