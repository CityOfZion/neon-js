import { tx, rpc, u } from "@cityofzion/neon-core";
import { calculateNetworkFee, getFeeInformation } from "../api";

export enum ValidationAttributes {
  None = 0,
  ValidUntilBlock = 1 << 0,
  SystemFee = 1 << 1,
  NetworkFee = 1 << 2,
  Script = 1 << 3,
  All = ValidUntilBlock | SystemFee | NetworkFee | Script,
}

export type ValidationSuggestion<T> = {
  valid: boolean;
  /**
   * Whether this is auto-fixed by validator.
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
  result: {
    validUntilBlock?: ValidationSuggestion<number>;
    script?: ValidationSuggestion<void>;
    systemFee?: ValidationSuggestion<u.BigInteger>;
    networkFee?: ValidationSuggestion<u.BigInteger>;
  };
}

/**
 * A class with functions to validate transaction
 */
export class TransactionValidator {
  public static TX_LIFESPAN_SUGGESTION = 240;
  /**
   * Transaction will be validated on this rpc node
   */
  public rpcClient: rpc.NeoServerRpcClient;

  /**
   * Transaction that will be validated
   */
  public transaction: tx.Transaction;

  constructor(rpc: rpc.NeoServerRpcClient, transaction: tx.Transaction) {
    this.rpcClient = rpc;
    this.transaction = transaction;
  }

  /**
   * validate validUntilBlock.
   * @param autoFix - autofix when number is below current height.
   */
  public async validateValidUntilBlock(
    autoFix = false
  ): Promise<ValidationSuggestion<number>> {
    const { validUntilBlock: prev } = this.transaction;
    const height = await this.rpcClient.getBlockCount();
    // Suggest a lifespan of approx. 1hr based on 15s blocks
    const suggestion = TransactionValidator.TX_LIFESPAN_SUGGESTION + height - 1;
    if (
      prev <= height ||
      prev >= height + tx.Transaction.MAX_TRANSACTION_LIFESPAN
    ) {
      if (autoFix) {
        this.transaction.validUntilBlock = suggestion;
        return fixed(prev, suggestion);
      }
      return invalid(
        prev,
        suggestion,
        "Your transaction lifespan was out of range."
      );
    }
    if (prev - height <= 20) {
      return suggest(
        prev,
        suggestion,
        "Your transaction has a very limited lifespan. Consider increasing it."
      );
    }
    return valid();
  }

  /**
   * Validate intents
   */
  public async validateScript(): Promise<ValidationSuggestion<void>> {
    const { state } = await this.rpcClient.invokeScript(
      this.transaction.script
    );
    if (state !== "HALT") {
      return err("Encountered FAULT when validating script.");
    }
    return valid();
  }

  /**
   * validate systemFee
   * @param autoFix - autofix when fee is too low.
   */
  public async validateSystemFee(
    autoFix = false
  ): Promise<ValidationSuggestion<u.BigInteger>> {
    const { script, systemFee: prev } = this.transaction;
    const invokeResponse = await this.rpcClient.invokeScript(script);

    if (invokeResponse.state === "FAULT") {
      return err(
        "Cannot get precise systemFee as script execution on node reports FAULT."
      );
    }
    const gasConsumed = invokeResponse.gasconsumed;
    const suggestion = u.BigInteger.fromDecimal(gasConsumed, 0);
    const compareResult = suggestion.compare(prev);
    if (compareResult > 0) {
      // Did not hit the minimum fees to run the script.
      if (autoFix) {
        this.transaction.systemFee = suggestion;
        return fixed(prev, suggestion);
      }
      return invalid(
        prev,
        suggestion,
        "Insufficient fees attached to run the script."
      );
    } else if (compareResult < 0) {
      // Overpaying for the script.
      return suggest(prev, suggestion, "Overpaying for running the script.");
    }
    return valid();
  }

  /**
   * Validate NetworkFee
   * @param autoFix - autofix when fee is too low.
   */
  public async validateNetworkFee(
    autoFix = false
  ): Promise<ValidationSuggestion<u.BigInteger>> {
    const { networkFee: prev } = this.transaction;

    const { feePerByte, executionFeeFactor } = await getFeeInformation(
      this.rpcClient
    );

    const suggestion = calculateNetworkFee(
      this.transaction,
      feePerByte,
      executionFeeFactor
    );
    const compareResult = suggestion.compare(prev);
    if (compareResult > 0) {
      // Underpaying
      if (autoFix) {
        this.transaction.networkFee = suggestion;
        return fixed(prev, suggestion);
      }
      return invalid(prev, suggestion, "Insufficient network fees.");
    } else if (compareResult < 0) {
      // Overpaying
      return suggest(prev, suggestion, "Overpaying network fee.");
    }
    return valid();
  }

  public async validate(
    attrs: ValidationAttributes,
    autoFix: ValidationAttributes = ValidationAttributes.None
  ): Promise<ValidationResult> {
    const validationTasks: Promise<ValidationSuggestion<unknown>>[] = [];
    const output: ValidationResult = {
      valid: true,
      result: {},
    };

    if (attrs & ValidationAttributes.ValidUntilBlock) {
      validationTasks.push(
        this.validateValidUntilBlock(
          (autoFix & ValidationAttributes.ValidUntilBlock) ===
            ValidationAttributes.ValidUntilBlock
        ).then((s) => (output.result.validUntilBlock = s))
      );
    }

    if (attrs & ValidationAttributes.SystemFee) {
      validationTasks.push(
        this.validateSystemFee(
          (autoFix & ValidationAttributes.SystemFee) ===
            ValidationAttributes.SystemFee
        ).then((s) => (output.result.systemFee = s))
      );
    }

    if (attrs & ValidationAttributes.NetworkFee) {
      validationTasks.push(
        this.validateNetworkFee(
          (autoFix & ValidationAttributes.NetworkFee) ===
            ValidationAttributes.NetworkFee
        ).then((s) => (output.result.networkFee = s))
      );
    }

    if (attrs & ValidationAttributes.Script) {
      validationTasks.push(
        this.validateScript().then((s) => (output.result.script = s))
      );
    }

    await Promise.all(validationTasks);
    output.valid = Object.values(output.result)
      .map((r) => (r ? r.valid : true))
      .reduce((a, b) => a && b);

    return output;
  }
}

function valid<T>(): ValidationSuggestion<T> {
  return { valid: true, fixed: false };
}
function fixed<T>(
  prev: T,
  suggestion?: T,
  message?: string
): ValidationSuggestion<T> {
  return {
    valid: true,
    fixed: true,
    prev,
    suggestion,
    message,
  };
}

function err<T>(message: string): ValidationSuggestion<T> {
  return {
    valid: false,
    fixed: false,
    message,
  };
}
function suggest<T>(
  prev: T,
  suggestion?: T,
  message?: string
): ValidationSuggestion<T> {
  return {
    valid: true,
    fixed: false,
    prev,
    suggestion,
    message,
  };
}

function invalid<T>(
  prev: T,
  suggestion?: T,
  message?: string
): ValidationSuggestion<T> {
  return {
    valid: false,
    fixed: false,
    prev,
    suggestion,
    message,
  };
}
