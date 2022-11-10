import {
  num2VarInt,
  StringStream,
  NeonSerializable,
  reverseHex,
  base642hex,
} from "../../u";
import { parseEnum } from "../../internal";

export enum TransactionAttributeType {
  HighPriority = 0x1,
  OracleResponse = 0x11,
}

export enum OracleResponseCode {
  // Indicates that the request has been successfully completed.
  Success = 0x00,
  // Indicates that the protocol of the request is not supported.
  ProtocolNotSupported = 0x10,
  // Indicates that the oracle nodes cannot reach a consensus on the result of the request.
  ConsensusUnreachable = 0x12,
  // Indicates that the requested Uri does not exist.
  NotFound = 0x14,
  // Indicates that the request was not completed within the specified time.
  Timeout = 0x16,
  // Indicates that there is no permission to request the resource.
  Forbidden = 0x18,
  // Indicates that the data for the response is too large.
  ResponseTooLarge = 0x1a,
  // Indicates that the request failed due to insufficient balance.
  InsufficientFunds = 0x1c,
  // Indicates that the content-type of the request is not supported.
  ContentTypeNotSupported = 0x1f,
  // Indicates that the request failed due to other errors.
  Error = 0xff,
}

export interface HighPriorityTransactionAttributeJson {
  type: "HighPriority";
}

export interface OracleResponseTransactionAttributeJson {
  type: "OracleResponse";
  // request id
  id: number;
  // response code
  code: string;
  // base64 encoded result for the request
  result: string;
}

export type TransactionAttributeJson =
  | HighPriorityTransactionAttributeJson
  | OracleResponseTransactionAttributeJson;

export interface TransactionAttributeLike {
  type: number;
}

export interface OracleResponseAttributeLike extends TransactionAttributeLike {
  id: number;
  code: OracleResponseCode;
  result: string;
}

export abstract class TransactionAttribute implements NeonSerializable {
  public abstract get type(): TransactionAttributeType;
  public abstract export(): TransactionAttributeLike;
  public abstract toJson(): TransactionAttributeJson;

  public get size(): number {
    return 1;
  }

  public static fromJson(
    input: TransactionAttributeJson
  ): TransactionAttribute {
    const attrType = parseEnum(input.type, TransactionAttributeType);
    const implementingClass = this.getImplementation(attrType);
    return implementingClass.fromJson(input as never);
  }

  public static fromStream(ss: StringStream): TransactionAttribute {
    return TransactionAttribute.deserialize(ss);
  }

  public static deserialize(ss: StringStream): TransactionAttribute {
    const rawType = parseInt(ss.peek(1), 16);
    const attrType = parseEnum(rawType, TransactionAttributeType);
    const implementingClass = this.getImplementation(attrType);
    return implementingClass.deserialize(ss);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  private static getImplementation(type: TransactionAttributeType) {
    switch (type) {
      case TransactionAttributeType.HighPriority:
        return HighPriorityAttribute;
      case TransactionAttributeType.OracleResponse:
        return OracleResponseAttribute;
      default:
        throw new Error(`Unknown TransactionAttributeType: ${type}`);
    }
  }

  serialize(): string {
    return this.type.toString(16).padStart(2, "0");
  }
}

export class HighPriorityAttribute extends TransactionAttribute {
  private static _type = TransactionAttributeType.HighPriority;
  public get type(): TransactionAttributeType {
    return HighPriorityAttribute._type;
  }

  public static fromJson(
    _: HighPriorityTransactionAttributeJson
  ): HighPriorityAttribute {
    return new HighPriorityAttribute();
  }

  public static deserialize(ss: StringStream): HighPriorityAttribute {
    readAndAssertType(ss, this._type);
    return new HighPriorityAttribute();
  }

  public toJson(): TransactionAttributeJson {
    return { type: "HighPriority" };
  }

  public export(): TransactionAttributeLike {
    return {
      type: this.type,
    };
  }
}

export class OracleResponseAttribute extends TransactionAttribute {
  private static _type = TransactionAttributeType.OracleResponse;
  public get type(): TransactionAttributeType {
    return OracleResponseAttribute._type;
  }

  public get size(): number {
    return this.serialize().length / 2;
  }

  public static fromJson(
    input: OracleResponseTransactionAttributeJson
  ): OracleResponseAttribute {
    const code = parseEnum(input.code, OracleResponseCode);
    return new OracleResponseAttribute(input.id, code, input.result);
  }

  public static deserialize(ss: StringStream): OracleResponseAttribute {
    readAndAssertType(ss, this._type);
    const id = parseInt(ss.read(8), 16);
    const codeName = OracleResponseCode[parseInt(ss.read(1), 16)];
    const code = parseEnum(codeName, OracleResponseCode);

    const resultSize = ss.readVarInt();
    if (resultSize > 0xffff) {
      throw new Error(`Results size exceeds maximum`);
    }
    const result = ss.read(resultSize);
    return new OracleResponseAttribute(id, code, result);
  }

  constructor(
    public id: number,
    public code: OracleResponseCode,
    public result: string
  ) {
    super();
  }
  public toJson(): TransactionAttributeJson {
    return {
      type: "OracleResponse",
      id: this.id,
      code: OracleResponseCode[this.code],
      result: this.result,
    };
  }

  public serialize(): string {
    const id = reverseHex(this.id.toString(16).padStart(16, "0"));
    const code = this.code.toString(16).padStart(2, "0");
    const result = base642hex(this.result.toString());
    const resultLen = num2VarInt(result.length / 2);
    return super.serialize() + id + code + resultLen + result;
  }

  public export(): OracleResponseAttributeLike {
    return {
      type: this.type,
      id: this.id,
      code: this.code,
      result: this.result,
    };
  }
}

function readAndAssertType(
  ss: StringStream,
  type: TransactionAttributeType
): void {
  const rawType = parseInt(ss.read(1), 16);
  const txType = parseEnum(rawType, TransactionAttributeType);
  if (txType !== type) {
    throw new Error(
      `Wrong TransactionAttributeType. Wanted ${TransactionAttributeType[type]} but got ${txType}`
    );
  }
}

export default TransactionAttribute;
