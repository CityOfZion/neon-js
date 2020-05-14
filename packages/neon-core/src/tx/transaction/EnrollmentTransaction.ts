import { TX_VERSION } from "../../consts";
import { DEFAULT_SYSFEE } from "../../consts";
import { StringStream } from "../../u";
import { getPublicKeyEncoded, getPublicKeyUnencoded } from "../../wallet/core";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";

export interface EnrollmentTransactionLike extends TransactionLike {
  publicKey: string;
}

export interface EnrollementExclusive {
  publicKey: string;
}

export class EnrollmentTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<TransactionLike>
  ): Partial<EnrollmentTransactionLike> {
    const hexStrPrefix = ss.read(1);
    const prefix = parseInt(hexStrPrefix, 16);

    let pKey = "";
    // Compressed public keys.
    if (prefix === 0x02 || prefix === 0x03) {
      pKey = ss.read(32);
    } else if (prefix === 0x04) {
      pKey = ss.read(64);
    } else if (prefix === 0x00) {
      // infinity case.
      return Object.assign(tx, { publicKey: "" });
    } else {
      throw new Error("Prefix not recognised for public key");
    }

    pKey = hexStrPrefix + pKey;

    const publicKey = getPublicKeyUnencoded(pKey);

    return Object.assign(tx, { publicKey });
  }

  public publicKey: string;

  public readonly type: TransactionType = TransactionType.EnrollmentTransaction;

  public constructor(obj: Partial<EnrollmentTransactionLike> = {}) {
    super(Object.assign({ version: TX_VERSION.ENROLLMENT }, obj));
    this.publicKey = obj.publicKey || "";
  }

  public get exclusiveData(): EnrollementExclusive {
    return { publicKey: this.publicKey };
  }

  public get fees(): number {
    return DEFAULT_SYSFEE.enrollmentTransaction;
  }

  public serializeExclusive(): string {
    if (this.publicKey === "") {
      return "00";
    }
    return getPublicKeyEncoded(this.publicKey);
  }

  public export(): EnrollmentTransactionLike {
    return Object.assign(super.export(), {
      publicKey: this.publicKey,
    });
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof EnrollmentTransaction) {
      return this.hash === other.hash;
    }
    return this.hash === new EnrollmentTransaction(other).hash;
  }
}

export default EnrollmentTransaction;
