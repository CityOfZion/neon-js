import { tx, rpc, u } from "@cityofzion/neon-core";
import { getNetworkFee, getScriptHashesFromTxWitnesses } from "./util";

export interface ValidationSuggestion<T> {
  prev: T;
  suggestion: T;
}

export interface ValidationResult {
  result: boolean;
  fixed: boolean;
  validaUntilBlock?: ValidationSuggestion<number>;
  systemFee?: ValidationSuggestion<u.Fixed8>;
  networkFee?: ValidationSuggestion<u.Fixed8>;
  witnesses?: {
    notSignedHash: string;
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
  validateValidUntilBlock = async (
    autoFix = false
  ): Promise<ValidationResult> => {
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
          result: true,
          fixed: true,
          validaUntilBlock: {
            prev: validUntilBlock,
            suggestion: vub_suggestion
          }
        };
      }
      return {
        result: false,
        fixed: false,
        validaUntilBlock: {
          prev: validUntilBlock,
          suggestion: vub_suggestion
        }
      };
    }
    return {
      result: true,
      fixed: false
    };
  };

  // validateIntents = async (): Promise<ValidationResult> => {
  //   return {
  //     result: true,
  //     fixed: false
  //   };
  // };

  /**
   * validate systemFee
   * @param autoFix will automatically fix transaction if specified as true
   */
  validateSystemFee = async (autoFix = false): Promise<ValidationResult> => {
    const { script, systemFee } = this.transaction;
    const { gas_consumed } = await this.rpcClient.invokeScript(script);
    const minimumSystemFee = new u.Fixed8(parseFloat(gas_consumed)).ceil();
    if (autoFix && !minimumSystemFee.equals(systemFee)) {
      this.transaction.systemFee = minimumSystemFee;
      return {
        result: true,
        fixed: true,
        systemFee: {
          prev: systemFee,
          suggestion: minimumSystemFee
        }
      };
    } else if (minimumSystemFee.isGreaterThan(systemFee)) {
      return {
        result: false,
        fixed: false,
        systemFee: {
          prev: systemFee,
          suggestion: minimumSystemFee
        }
      };
    }
    return {
      result: true,
      fixed: false
    };
  };

  /**
   * Validate NetworkFee
   * @param autoFix will automatically fix transaction if specified as true
   */
  validateNetworkFee = async (autoFix = false): Promise<ValidationResult> => {
    const { networkFee } = this.transaction;
    const minimumNetworkFee = getNetworkFee(this.transaction);
    if (autoFix && !minimumNetworkFee.equals(networkFee)) {
      this.transaction.networkFee = minimumNetworkFee;
      return {
        result: true,
        fixed: true,
        networkFee: {
          prev: networkFee,
          suggestion: minimumNetworkFee
        }
      };
    } else if (minimumNetworkFee.isGreaterThan(networkFee)) {
      return {
        result: false,
        fixed: false,
        networkFee: {
          prev: networkFee,
          suggestion: minimumNetworkFee
        }
      };
    }
    return {
      result: true,
      fixed: false
    };
  };

  /**
   * Validate Signatures
   */
  validateSigning = async (): Promise<ValidationResult> => {
    const scriptHashes: string[] = getScriptHashesFromTxWitnesses(
      this.transaction
    );
    const signers = this.transaction
      .getScriptHashesForVerifying()
      .map(hash => u.reverseHex(hash));

    let notSignedHash = "";
    if (
      signers.every(signer => {
        if (scriptHashes.indexOf(signer) < 0) {
          notSignedHash = signer;
          return false;
        }
        return true;
      })
    ) {
      return {
        result: true,
        fixed: false
      };
    }

    return {
      result: false,
      fixed: false,
      witnesses: {
        notSignedHash
      }
    };
  };
}
