import {
  hash160,
  num2VarInt,
  reverseHex,
  StringStream,
  HexString,
} from "../../u";
import {
  Account,
  getPublicKeysFromVerificationScript,
  getSignaturesFromInvocationScript,
  getSigningThresholdFromVerificationScript,
  getVerificationScriptFromPublicKey,
  verify,
} from "../../wallet";
import { NeonObject } from "../../model";

export interface WitnessLike {
  invocationScript: string;
  verificationScript: string;
}

export interface WitnessJson {
  // base64 encoded
  invocation: string;
  // base64 encoded
  verification: string;
}

/**
 * A Witness is a section of VM code that is ran during the verification of the transaction.
 *
 * For example, the most common witness is the VM Script that pushes the ECDSA signature into the VM and calling CHECKSIG to prove the authority to spend the TransactionInputs in the transaction.
 */
export class Witness implements NeonObject<WitnessLike> {
  public static deserialize(hex: string): Witness {
    const ss = new StringStream(hex);
    return this.fromStream(ss);
  }

  public static fromJson(input: WitnessJson): Witness {
    return new Witness({
      invocationScript: HexString.fromBase64(input.invocation),
      verificationScript: HexString.fromBase64(input.verification),
    });
  }

  public static fromStream(ss: StringStream): Witness {
    const invocationScript = ss.readVarBytes();
    const verificationScript = ss.readVarBytes();
    return new Witness({ invocationScript, verificationScript });
  }

  public static fromSignature(sig: string, publicKey: string): Witness {
    const invocationScript = "0c40" + sig;
    const verificationScript = getVerificationScriptFromPublicKey(publicKey);
    return new Witness({ invocationScript, verificationScript });
  }

  /**
   * Builds a multi-sig Witness object.
   * @param tx - hexstring to be signed.
   * @param sigs - unordered list of signatures.
   * @param acctOrVerificationScript - account or verification script. Account needs to be the multi-sig account and not one of the public keys.
   */
  public static buildMultiSig(
    tx: string,
    sigs: (string | Witness)[],
    acctOrVerificationScript: Account | string
  ): Witness {
    const verificationScript =
      typeof acctOrVerificationScript === "string"
        ? acctOrVerificationScript
        : HexString.fromBase64(
            acctOrVerificationScript.contract.script
          ).toBigEndian();

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
          element.verificationScript.toBigEndian()
        );
        if (keys.length !== 1) {
          throw new Error("Given witness contains more than 1 public key!");
        }
        const position = publicKeys.indexOf(keys[0]);
        orderedSigs[position] = getSignaturesFromInvocationScript(
          element.invocationScript.toBigEndian()
        )[0];
      } else {
        throw new Error("Unable to process given signature");
      }
    });
    const signingThreshold = getSigningThresholdFromVerificationScript(
      verificationScript
    );
    const validSigs = orderedSigs.filter((s) => s !== "");
    if (validSigs.length < signingThreshold) {
      throw new Error(
        `Insufficient signatures: expected ${signingThreshold} but got ${validSigs.length} instead`
      );
    }
    return new Witness({
      invocationScript: validSigs
        .slice(0, signingThreshold)
        .map((s) => "0c40" + s)
        .join(""),
      verificationScript,
    });
  }

  public invocationScript: HexString;
  public verificationScript: HexString;

  #scriptHash = "";

  public constructor(obj: Partial<WitnessLike | Witness> = {}) {
    if (
      typeof obj.invocationScript === "undefined" ||
      typeof obj.verificationScript === "undefined"
    ) {
      throw new Error(
        "Witness requires invocationScript and verificationScript fields"
      );
    }
    this.invocationScript = HexString.fromHex(obj.invocationScript);
    this.verificationScript = HexString.fromHex(obj.verificationScript);
  }

  public get size(): number {
    return (
      num2VarInt(this.invocationScript.byteLength).length / 2 +
      num2VarInt(this.verificationScript.byteLength).length / 2 +
      this.verificationScript.byteLength +
      this.invocationScript.byteLength
    );
  }

  public get scriptHash(): string {
    if (this.#scriptHash) {
      return this.#scriptHash;
    } else if (this.verificationScript) {
      this.#scriptHash = reverseHex(
        hash160(this.verificationScript.toBigEndian())
      );
      return this.#scriptHash;
    } else {
      throw new Error(
        "Unable to produce scriptHash from empty verificationScript"
      );
    }
  }

  public serialize(): string {
    const invoLength = num2VarInt(this.invocationScript.byteLength);
    const veriLength = num2VarInt(this.verificationScript.byteLength);
    return (
      invoLength +
      this.invocationScript.toBigEndian() +
      veriLength +
      this.verificationScript.toBigEndian()
    );
  }

  public export(): WitnessLike {
    return {
      invocationScript: this.invocationScript.toBigEndian(),
      verificationScript: this.verificationScript.toBigEndian(),
    };
  }

  public toJson(): WitnessJson {
    return {
      invocation: this.invocationScript.toBase64(),
      verification: this.verificationScript.toBase64(),
    };
  }

  public equals(other: Partial<WitnessLike | Witness>): boolean {
    return (
      this.invocationScript.equals(other.invocationScript ?? "") &&
      this.verificationScript.equals(other.verificationScript ?? "")
    );
  }

  private generateScriptHash(): void {
    this.#scriptHash = reverseHex(
      hash160(this.verificationScript.toBigEndian())
    );
  }
}

export default Witness;
