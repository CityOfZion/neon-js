import { tx, rpc, u, sc } from "@cityofzion/neon-core";
import { getNetworkFee } from "./util";

export enum ValidationAttributes {
  None = 0,
  ValidUntilBlock = 1 << 0,
  SystemFee = 1 << 1,
  NetworkFee = 1 << 2,
  Script = 1 << 3,
  All = ValidUntilBlock | SystemFee | NetworkFee | Script,
}

export type ValidationSuggestion<T> = {
  /**
   * Whether this is auto-fixed by validator
   * Validator will try to fix the transaction when param `autoFix` is set to TRUE
   */
  fixed: boolean;
  prev?: T;
  suggestion?: T;
  message?: string;
};

export interface ValidationResult {
  /**
   * Whether the transaction is valid after validation
   */
  valid: boolean;
  result?: {
    validUntilBlock?: ValidationSuggestion<number>;
    script?: ValidationSuggestion<string>;
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
   * @param autoFix - will automatically fix transaction if specified as true
   */
  public async validateValidUntilBlock(
    autoFix = false
  ): Promise<ValidationResult> {
    const { validUntilBlock } = this.transaction;
    const height = await this.rpcClient.getBlockCount();
    if (
      validUntilBlock <= height ||
      validUntilBlock >= height + tx.Transaction.MAX_TRANSACTION_LIFESPAN
    ) {
      const suggestion = tx.Transaction.MAX_TRANSACTION_LIFESPAN + height - 1;
      if (autoFix) {
        this.transaction.validUntilBlock = suggestion;
        return {
          valid: true,
          result: {
            validUntilBlock: {
              fixed: true,
              prev: validUntilBlock,
              suggestion,
            },
          },
        };
      }
      return {
        valid: false,
        result: {
          validUntilBlock: {
            fixed: false,
            prev: validUntilBlock,
            suggestion,
          },
        },
      };
    }
    return {
      valid: true,
    };
  }

  private async _validateIntent(
    intent: sc.ScriptIntent
  ): Promise<string | null> {
    const { scriptHash, operation } = intent;
    const manifest = await this.rpcClient.getContractState(scriptHash);
    if (manifest === null) {
      return `Unknown contract ${scriptHash}`;
    }

    if (operation) {
      if (
        manifest.abi.methods.map((method) => method.name).indexOf(operation) < 0
      ) {
        return `Unknown method ${operation} for contract ${scriptHash}`;
      }
    }

    return null;
  }

  /**
   * Validate intents
   */
  public async validateScript(): Promise<ValidationResult> {
    const { state } = await this.rpcClient.invokeScript(
      this.transaction.script.toBigEndian()
    );
    if (state === "FAULT") {
      return {
        valid: false,
        result: {
          script: {
            fixed: false,
            message: "Encountered FAULT when validating script.",
          },
        },
      };
    }

    const intents = new sc.ScriptParser(
      this.transaction.script.toBigEndian()
    ).toScriptParams();
    const intentsRes: Array<string> = [];
    await Promise.all(
      intents.map((intent) =>
        this._validateIntent(intent).then((res) =>
          res ? intentsRes.push(res) : res
        )
      )
    );
    if (intentsRes.length > 0) {
      return {
        valid: false,
        result: {
          script: {
            fixed: false,
            message: intentsRes.join(";"),
          },
        },
      };
    } else {
      return {
        valid: true,
      };
    }
  }

  private _validateSystemFee(
    minimumSystemFee: u.Fixed8,
    autoFix = false
  ): ValidationResult {
    const { systemFee } = this.transaction;
    if (autoFix && !minimumSystemFee.equals(systemFee)) {
      this.transaction.systemFee = minimumSystemFee;
      return {
        valid: true,
        result: {
          systemFee: {
            fixed: true,
            prev: systemFee,
            suggestion: minimumSystemFee,
          },
        },
      };
    } else if (
      minimumSystemFee.isGreaterThan(systemFee) ||
      !systemFee.equals(systemFee.ceil())
    ) {
      return {
        valid: false,
        result: {
          systemFee: {
            fixed: false,
            prev: systemFee,
            suggestion: minimumSystemFee,
          },
        },
      };
    } else if (minimumSystemFee.isLessThan(systemFee)) {
      return {
        valid: true,
        result: {
          systemFee: {
            fixed: false,
            prev: systemFee,
            suggestion: minimumSystemFee,
          },
        },
      };
    }
    return {
      valid: true,
    };
  }

  /**
   * validate systemFee
   * @param autoFix - will automatically fix transaction if specified as true
   */
  public async validateSystemFee(autoFix = false): Promise<ValidationResult> {
    const { script } = this.transaction;
    const {
      state,
      gasconsumed: gasConsumed,
    } = await this.rpcClient.invokeScript(script.toBigEndian());

    if (state === "FAULT") {
      return {
        valid: false,
        result: {
          systemFee: {
            fixed: false,
            message:
              "Cannot get precise systemFee as script execution on node reports FAULT.",
          },
        },
      };
    }

    const minimumSystemFee = new u.Fixed8(parseFloat(gasConsumed))
      .mul(1e-8)
      .ceil();
    return this._validateSystemFee(minimumSystemFee, autoFix);
  }

  /**
   * Validate NetworkFee
   * @param autoFix - will automatically fix transaction if specified as true
   */
  public async validateNetworkFee(autoFix = false): Promise<ValidationResult> {
    const { networkFee } = this.transaction;
    const minimumNetworkFee = getNetworkFee(this.transaction);
    if (autoFix && !minimumNetworkFee.equals(networkFee)) {
      this.transaction.networkFee = minimumNetworkFee;
      return {
        valid: true,
        result: {
          networkFee: {
            fixed: true,
            prev: networkFee,
            suggestion: minimumNetworkFee,
          },
        },
      };
    } else if (minimumNetworkFee.isGreaterThan(networkFee)) {
      return {
        valid: false,
        result: {
          networkFee: {
            fixed: false,
            prev: networkFee,
            suggestion: minimumNetworkFee,
          },
        },
      };
    } else if (minimumNetworkFee.isLessThan(networkFee)) {
      return {
        valid: true,
        result: {
          networkFee: {
            fixed: false,
            prev: networkFee,
            suggestion: minimumNetworkFee,
          },
        },
      };
    }

    return {
      valid: true,
    };
  }

  public async validate(
    attrs: ValidationAttributes,
    autoFix: ValidationAttributes = ValidationAttributes.None
  ): Promise<ValidationResult> {
    const validationTasks: Array<Promise<ValidationResult>> = [];
    if (attrs & ValidationAttributes.ValidUntilBlock) {
      validationTasks.push(
        this.validateValidUntilBlock(
          Boolean(autoFix & ValidationAttributes.ValidUntilBlock)
        )
      );
    }

    if (attrs & ValidationAttributes.SystemFee) {
      validationTasks.push(
        this.validateSystemFee(
          Boolean(autoFix & ValidationAttributes.SystemFee)
        )
      );
    }

    if (attrs & ValidationAttributes.NetworkFee) {
      validationTasks.push(
        this.validateNetworkFee(
          Boolean(autoFix & ValidationAttributes.NetworkFee)
        )
      );
    }

    if (
      !(attrs & ValidationAttributes.SystemFee) &&
      attrs & ValidationAttributes.Script
    ) {
      validationTasks.push(this.validateScript());
    }

    return Promise.all(validationTasks).then((res) =>
      res.reduce((prev, cur) => {
        return {
          valid: prev.valid && cur.valid,
          result: {
            ...prev.result,
            ...cur.result,
          },
        };
      })
    );
  }
}
