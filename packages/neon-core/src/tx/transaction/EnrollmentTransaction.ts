import {
  getPublicKeyEncoded,
  getPublicKeyUnencoded
} from "../../../src/wallet/core";
import { TX_VERSION } from "../../consts";
import { DEFAULT_SYSFEE } from "../../consts";
import { num2hexstring, num2VarInt, reverseHex, StringStream } from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";

export interface EnrollmentTransactionLike extends TransactionLike {
  publicKey: string;
}

export class EnrollmentTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<TransactionLike>
  ): Partial<EnrollmentTransactionLike> {
    const hexStrPrefix = ss.read(1);
    const prefix = parseInt(hexStrPrefix, 16);

    let pKey: string = "";
    // Compressed public keys.
    if (prefix === 0x02 || prefix === 0x03) {
      pKey = ss.read(32);
    } else if (prefix === 0x04) {
      pKey = ss.read(65);
    } else if (prefix === 0x00) {
      // do nothing, For infinity, the p.Key == 0x00, included in the prefix
    } else {
      throw new Error("Prefix not recognised for public key");
    }

    pKey = hexStrPrefix + pKey;

    const publicKey = getPublicKeyUnencoded(pKey);

    return Object.assign(tx, { publicKey });
  }

  public publicKey: string;

  public readonly type: TransactionType = TransactionType.EnrollmentTransaction;

  constructor(obj: Partial<EnrollmentTransactionLike> = {}) {
    super(Object.assign({ version: TX_VERSION.ENROLLMENT }, obj));
    this.publicKey = obj.publicKey || "";
  }

  get exclusiveData() {
    return { publicKey: this.publicKey };
  }

  get fees(): number {
    return DEFAULT_SYSFEE.enrollmentTransaction;
  }

  public serializeExclusive(): string {
    if (this.publicKey === "") {
      return "";
    }
    return getPublicKeyEncoded(this.publicKey);
  }

  public export(): EnrollmentTransactionLike {
    return Object.assign(super.export(), {
      publicKey: this.publicKey
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
