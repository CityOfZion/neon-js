import { TX_VERSION } from "../../consts";
import {
  ab2hexstring,
  hexstring2str,
  num2hexstring,
  num2VarInt,
  str2hexstring,
  StringStream
} from "../../u";
import { BaseTransaction, TransactionLike } from "./BaseTransaction";
import TransactionType from "./TransactionType";

export enum ContractParameterType {
  Signature = 0x00,
  Boolean = 0x01,
  Integer = 0x02,
  Hash160 = 0x03,
  Hash256 = 0x04,
  ByteArray = 0x05,
  PublicKey = 0x06,
  String = 0x07,
  Array = 0x10,
  Map = 0x12,
  InteropInterface = 0xf0,
  Void = 0xff
}

export interface PublishTransactionLike extends TransactionLike {
  script: string;
  parameterList: ContractParameterType[];
  returnType: ContractParameterType;
  needStorage: boolean;
  name: string;
  codeVersion: string;
  author: string;
  email: string;
  description: string;
}

export interface PublishExclusive {
  script: string;
  parameterList: ContractParameterType[];
  returnType: ContractParameterType;
  needStorage: boolean;
  name: string;
  codeVersion: string;
  author: string;
  email: string;
  description: string;
}

export class PublishTransaction extends BaseTransaction {
  public static version: number = 0;

  public static deserializeExclusive(
    ss: StringStream,
    tx: Partial<TransactionLike>
  ): Partial<PublishTransactionLike> {
    if (this.version > 1) {
      throw new Error(
        `version need to be less or equal than 1. Got ${this.version}`
      );
    }

    const script = ss.readVarBytes();
    const paramList = ss.readVarBytes();
    const parameterList: ContractParameterType[] = [];

    for (let i = 0; i + 2 <= paramList.length; i = i + 2) {
      parameterList.push(parseInt(paramList.substring(i, i + 2), 16));
    }

    const returnType = parseInt(ss.read(1), 16);

    if (this.version >= 1) {
      throw new Error(
        `version need to be less or equal than 1. Got ${this.version}`
      );
    }
    let NeedStorage = false;
    if (this.version >= 1) {
      NeedStorage = !!parseInt(ss.read(1), 16);
    }

    const name = hexstring2str(ss.readVarBytes());
    const codeVersion = hexstring2str(ss.readVarBytes());
    const author = hexstring2str(ss.readVarBytes());
    const email = hexstring2str(ss.readVarBytes());
    const description = hexstring2str(ss.readVarBytes());

    return Object.assign(tx, {
      script,
      parameterList,
      returnType,
      NeedStorage,
      name,
      codeVersion,
      author,
      email,
      description
    });
  }

  public readonly type: TransactionType = TransactionType.PublishTransaction;

  public script: string;
  public parameterList: ContractParameterType[];
  public returnType: ContractParameterType;
  public needStorage: boolean;
  public name: string;
  public codeVersion: string;
  public author: string;
  public email: string;
  public description: string;

  public get exclusiveData(): PublishExclusive {
    return {
      script: this.script,
      parameterList: this.parameterList,
      returnType: this.returnType,
      needStorage: this.needStorage,
      name: this.name,
      codeVersion: this.codeVersion,
      author: this.author,
      email: this.email,
      description: this.description
    };
  }

  public get fees(): number {
    return 0;
  }

  public constructor(obj: Partial<PublishTransactionLike> = {}) {
    super(Object.assign({ version: TX_VERSION.PUBLISH }, obj));
    this.script = obj.script || "";
    this.parameterList = obj.parameterList || [0];
    this.returnType = obj.returnType || 0;
    this.needStorage = obj.needStorage || false;
    this.name = obj.name || "";
    this.codeVersion = obj.codeVersion || "";
    this.author = obj.author || "";
    this.email = obj.email || "";
    this.description = obj.description || "";
  }

  public serializeExclusive(): string {
    let out = num2VarInt(this.script.length / 2);
    out += this.script;
    out += num2VarInt(this.parameterList.length);
    out += ab2hexstring(this.parameterList);
    if (this.version >= 1) {
      out += num2hexstring(this.needStorage, 1);
    }
    out += num2VarInt(this.returnType);
    out += num2VarInt(this.name.length);
    out += str2hexstring(this.name);
    out += num2VarInt(this.codeVersion.length);
    out += str2hexstring(this.codeVersion);
    out += num2VarInt(this.author.length);
    out += str2hexstring(this.author);
    out += num2VarInt(this.email.length);
    out += str2hexstring(this.email);
    out += num2VarInt(this.description.length);
    out += str2hexstring(this.description);

    return out;
  }

  public equals(other: Partial<TransactionLike>): boolean {
    if (this.type !== other.type) {
      return false;
    }
    if (other instanceof PublishTransaction) {
      return this.hash === other.hash;
    }
    return this.hash === new PublishTransaction(other).hash;
  }

  public export(): PublishTransactionLike {
    return Object.assign(super.export(), {
      script: this.script,
      parameterList: this.parameterList,
      returnType: this.returnType,
      needStorage: this.needStorage,
      name: this.name,
      codeVersion: this.codeVersion,
      author: this.author,
      email: this.email,
      description: this.description
    });
  }
}

export default PublishTransaction;
