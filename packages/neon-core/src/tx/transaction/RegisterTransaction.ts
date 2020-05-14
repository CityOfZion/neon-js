import { ASSET_TYPE, DEFAULT_SYSFEE, TX_VERSION } from "../../consts";
import {
  Fixed8,
  fixed82num,
  hexstring2str,
  num2hexstring,
  num2VarInt,
  reverseHex,
  str2hexstring,
  StringStream,
} from "../../u";
import { getPublicKeyEncoded, getPublicKeyUnencoded } from "../../wallet/core";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";

export interface RegisterTransactionLike extends TransactionLike {
  assetType: number; // uint8
  name: string;
  amount: number | Fixed8;
  precision: number; // uint8
  owner: string; // publicKey
  admin: string; // 20 byte hexstring
}

export interface RegisterExclusive {
  assetType: number;
  name: string;
  amount: Fixed8;
  precision: number;
  owner: string;
  admin: string;
}

export class RegisterTransaction extends BaseTransaction {
  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<RegisterTransaction>
  ): Partial<RegisterTransactionLike> {
    const assetType = parseInt(reverseHex(ss.read(1)), 16);
    const name = hexstring2str(ss.readVarBytes());
    const amount = fixed82num(ss.read(8));
    const precision = parseInt(reverseHex(ss.read(1)), 16);

    // TODO: extract a method to get the publicKey. Refactor both
    // enrollment transaction and register transaction
    const hexStrPrefix = ss.read(1);
    const prefix = parseInt(hexStrPrefix, 16);

    let pKey = "";
    let owner = "";
    // Compressed public keys.
    if (prefix === 0x02 || prefix === 0x03) {
      pKey = ss.read(32);
    } else if (prefix === 0x04) {
      pKey = ss.read(64);
    } else if (prefix === 0x00) {
      // do nothing, For infinity, the p.Key == 0x00, included in the prefix
    } else {
      throw new Error("Prefix not recognised for public key");
    }

    if (pKey !== "") {
      pKey = hexStrPrefix + pKey;
      owner = getPublicKeyUnencoded(pKey);
    }

    const admin = reverseHex(ss.read(20));

    return Object.assign(tx, {
      assetType,
      name,
      amount,
      precision,
      owner,
      admin,
    });
  }

  public assetType: number;
  public name: string;
  public amount: Fixed8;
  public precision: number;
  public owner: string;
  public admin: string;

  public readonly type: TransactionType = TransactionType.RegisterTransaction;

  public constructor(obj: Partial<RegisterTransactionLike> = {}) {
    super(Object.assign({ version: TX_VERSION.REGISTER }, obj));
    this.assetType = obj.assetType || 0;
    this.name = obj.name || "";
    this.amount = new Fixed8(obj.amount);
    this.precision = obj.precision || 0;
    this.owner = obj.owner || "";
    this.admin = obj.admin || "";
  }

  public get exclusiveData(): RegisterExclusive {
    return {
      assetType: this.assetType,
      name: this.name,
      amount: this.amount,
      precision: this.precision,
      owner: this.owner,
      admin: this.admin,
    };
  }

  public get fees(): number {
    if (
      this.assetType === ASSET_TYPE.GoverningToken ||
      this.assetType === ASSET_TYPE.UtilityToken
    ) {
      return 0;
    }
    return DEFAULT_SYSFEE.registerTransaction;
  }

  public serializeExclusive(): string {
    let out = num2hexstring(this.assetType, 1, true);
    out += num2VarInt(this.name.length);
    out += str2hexstring(this.name);
    out += this.amount.toReverseHex();
    out += num2hexstring(this.precision, 1, true);
    out += getPublicKeyEncoded(this.owner);
    out += reverseHex(this.admin);
    return out;
  }

  public export(): RegisterTransactionLike {
    return Object.assign(super.export(), {
      assetType: this.assetType,
      name: this.name,
      amount: this.amount.toNumber(),
      precision: this.precision,
      owner: this.owner,
      admin: this.admin,
    });
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof RegisterTransaction) {
      return this.hash === other.hash;
    }
    return this.hash === new RegisterTransaction(other).hash;
  }
}

export default RegisterTransaction;
