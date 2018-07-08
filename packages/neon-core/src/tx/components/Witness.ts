import { num2VarInt, StringStream } from "../../u";
import { getVerificationScriptFromPublicKey } from "../../wallet";

export interface WitnessLike {
  invocationScript: string;
  verificationScript: string;
}

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

  public invocationScript: string;
  public verificationScript: string;

  constructor(obj: WitnessLike) {
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
      verificationScript: this.verificationScript
    };
  }

  public equals(other: WitnessLike): boolean {
    return (
      this.invocationScript === other.invocationScript &&
      this.verificationScript === other.verificationScript
    );
  }
}

export default Witness;
