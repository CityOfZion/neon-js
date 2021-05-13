import { hash160, num2VarInt, reverseHex, StringStream } from "../../u";
import {
  Account,
  getPublicKeysFromVerificationScript,
  getSignaturesFromInvocationScript,
  getSigningThresholdFromVerificationScript,
  getVerificationScriptFromPublicKey,
  verify,
} from "../../wallet";

export interface WitnessLike {
  invocationScript: string;
  verificationScript: string;
}

/**
 * A Witness is a section of VM code that is ran during the verification of the transaction.
 *
 * For example, the most common witness is the VM Script that pushes the ECDSA signature into the VM and calling CHECKSIG to prove the authority to spend the TransactionInputs in the transaction.
 */
export class Witness {
  public static deserialize(hex: string): Witness {
    const ss = new StringStream(hex);
    return this.fromStream(ss);
  }

  public static fromStream(ss: StringStream): Witness {
    const invocationScript = ss.readVarBytes();
    const verificationScript = ss.readVarBytes();
    return new Witness({ invocationScript, verificationScript });
  }

  public static fromSignature(sig: string, publicKey: string): Witness {
    const invocationScript = "40" + sig;
    const verificationScript = getVerificationScriptFromPublicKey(publicKey);
    return new Witness({ invocationScript, verificationScript });
  }

  /**
   * Builds a multi-sig Witness object.
   * @param tx Hexstring to be signed.
   * @param sigs Unordered list of signatures.
   * @param acctOrVerificationScript Account or verification script. Account needs to be the multi-sig account and not one of the public keys.
   */
  public static buildMultiSig(
    tx: string,
    sigs: (string | Witness)[],
    acctOrVerificationScript: Account | string
  ): Witness {
    const verificationScript =
      typeof acctOrVerificationScript === "string"
        ? acctOrVerificationScript
        : acctOrVerificationScript.contract.script;

    const publicKeys = getPublicKeysFromVerificationScript(verificationScript);
    const orderedSigs = Array(publicKeys.length).fill("");
    sigs.forEach((element) => {
      if (typeof element === "string") {
        const position = publicKeys.findIndex((key) =>
          verify(tx, element, key)
        );
        if (position === -1) {
          throw new Error(`Invalid signature given: ${element}`);
        }
        orderedSigs[position] = element;
      } else if (element instanceof Witness) {
        const keys = getPublicKeysFromVerificationScript(
          element.verificationScript
        );
        if (keys.length !== 1) {
          throw new Error("Given witness contains more than 1 public key!");
        }
        const position = publicKeys.indexOf(keys[0]);
        orderedSigs[position] = getSignaturesFromInvocationScript(
          element.invocationScript
        )[0];
      } else {
        throw new Error("Unable to process given signature");
      }
    });
    const signingThreshold =
      getSigningThresholdFromVerificationScript(verificationScript);
    const validSigs = orderedSigs.filter((s) => s !== "");
    if (validSigs.length < signingThreshold) {
      throw new Error(
        `Insufficient signatures: expected ${signingThreshold} but got ${validSigs.length} instead`
      );
    }
    return new Witness({
      invocationScript: validSigs
        .slice(0, signingThreshold)
        .map((s) => "40" + s)
        .join(""),
      verificationScript,
    });
  }

  public invocationScript: string;
  public verificationScript: string;

  // tslint:disable-next-line:variable-name
  private _scriptHash = "";

  public constructor(obj: WitnessLike) {
    if (
      !obj ||
      obj.invocationScript === undefined ||
      obj.verificationScript === undefined
    ) {
      throw new Error(
        "Witness requires invocationScript and verificationScript fields"
      );
    }
    this.invocationScript = obj.invocationScript;
    this.verificationScript = obj.verificationScript;
  }

  public get scriptHash(): string {
    if (this._scriptHash) {
      return this._scriptHash;
    } else if (this.verificationScript) {
      this._scriptHash = reverseHex(hash160(this.verificationScript));
      return this._scriptHash;
    } else {
      throw new Error(
        "Unable to produce scriptHash from empty verificationScript"
      );
    }
  }

  public set scriptHash(value: string) {
    if (this.verificationScript) {
      throw new Error(
        "Unable to set scriptHash when verificationScript is not empty"
      );
    }
    this._scriptHash = value;
  }

  public serialize(): string {
    const invoLength = num2VarInt(this.invocationScript.length / 2);
    const veriLength = num2VarInt(this.verificationScript.length / 2);
    return (
      invoLength + this.invocationScript + veriLength + this.verificationScript
    );
  }

  public export(): WitnessLike {
    return {
      invocationScript: this.invocationScript,
      verificationScript: this.verificationScript,
    };
  }

  public equals(other: WitnessLike): boolean {
    return (
      this.invocationScript === other.invocationScript &&
      this.verificationScript === other.verificationScript
    );
  }

  private generateScriptHash(): void {
    this._scriptHash = reverseHex(hash160(this.verificationScript));
  }
}

export default Witness;
