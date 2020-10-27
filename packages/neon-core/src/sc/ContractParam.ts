import { BigInteger, HexString } from "../u";
import { getScriptHashFromAddress, isAddress } from "../wallet";
import { NeonObject } from "../model";
import { parseEnum } from "../internal";

export enum ContractParamType {
  Any = 0x00,

  Boolean = 0x10,
  Integer = 0x11,
  ByteArray = 0x12,
  String = 0x13,
  Hash160 = 0x14,
  Hash256 = 0x15,
  PublicKey = 0x16,
  Signature = 0x17,

  Array = 0x20,
  Map = 0x22,

  InteropInterface = 0x30,

  Void = 0xff,
}

export interface ContractParamJson {
  type: string;
  value?: string | boolean | number | ContractParamJson[] | null;
}

export type ContractParamLike = Pick<
  ContractParamJson | ContractParam,
  keyof ContractParamJson
>;

/**
 * These are the parameters used for interacting with smart contracts.
 * Depending on the type, the data is stored differently.
 * The constructor only validates the input types. It does not do transformation.
 * The static methods provide safe parsing from various data types into their intended final storage form.
 *
 * @example
 *
 * ContractParam.integer(1);
 * ContractParam.boolean(true);
 * ContractParam.string("12ab");
 */
export class ContractParam implements NeonObject<ContractParamLike> {
  /**
   * Creates a String ContractParam.
   *
   * @param value - UTF8 string.
   */
  public static string(value: string): ContractParam {
    return new ContractParam({
      type: ContractParamType.String,
      value,
    });
  }

  /**
   * Creates a Boolean ContractParam. Does basic checks to convert value into a boolean. Value field will be a boolean.
   */
  public static boolean(value: boolean | string | number): ContractParam {
    return new ContractParam({
      type: ContractParamType.Boolean,
      value: !!value,
    });
  }

  public static publicKey(value: string | HexString): ContractParam {
    return new ContractParam({
      type: ContractParamType.PublicKey,
      value: value instanceof HexString ? value : HexString.fromHex(value),
    });
  }

  /**
   * Creates a Hash160 ContractParam. This is used for containing a scriptHash. Value field will be a HexString.
   * Do not reverse the input if using this format.
   * @param value - A 40 character long hexstring. Automatically converts an address to scripthash if provided.
   */
  public static hash160(value: string | HexString): ContractParam {
    if (value instanceof HexString) {
      return new ContractParam({ type: ContractParamType.Hash160, value });
    }

    if (isAddress(value)) {
      value = getScriptHashFromAddress(value);
    }
    if (value.length !== 40) {
      throw new Error(
        `hash160 expected a 40 character string but got ${value.length} chars instead.`
      );
    }
    return new ContractParam({
      type: ContractParamType.Hash160,
      value: HexString.fromHex(value),
    });
  }

  /**
   * Creates an Integer ContractParam. This is converted into an BigInteger in NeoVM. Value field will be a string.
   * @param value - A value that can be parsed to an BigInteger. Numbers or numeric strings are accepted.
   * @example
   * ContractParam.integer(128);
   * ContractParam.integer("128");
   * ContractParam.integer(BigInteger.fromNumber(128));
   */
  public static integer(value: string | number | BigInteger): ContractParam {
    if (typeof value === "string") {
      return new ContractParam({
        type: ContractParamType.Integer,
        value: value.split(".")[0],
      });
    }

    if (typeof value === "number") {
      return new ContractParam({
        type: ContractParamType.Integer,
        value: Math.round(value).toString(),
      });
    }
    if (value instanceof BigInteger) {
      return new ContractParam({
        type: ContractParamType.Integer,
        value: value.toString(),
      });
    }

    throw new Error(`Unknown input provided: ${value}`);
  }

  /**
   * Creates a ByteArray ContractParam. Value field will be a HexString.
   * @param value - a string or HexString.
   */
  public static byteArray(value: string | HexString): ContractParam {
    if (typeof value === "string") {
      return new ContractParam({
        type: ContractParamType.ByteArray,
        value: HexString.fromHex(value),
      });
    }

    if (value instanceof HexString) {
      return new ContractParam({ type: ContractParamType.ByteArray, value });
    }

    throw new Error(`Unknown input provided: ${value}`);
  }

  /**
   * Creates a Void ContractParam. Value field will be set to null.
   */
  public static void(): ContractParam {
    return new ContractParam({ type: ContractParamType.Void });
  }

  /**
   * Creates an Array ContractParam. Value field will be a ContractParam array.
   * @param params - params to be encapsulated in an array.
   */
  public static array(...params: ContractParamLike[]): ContractParam {
    const value = params.map((i) => ContractParam.fromJson(i));
    return new ContractParam({ type: ContractParamType.Array, value });
  }

  public type: ContractParamType;
  public value: string | boolean | HexString | ContractParam[] | null;

  public constructor(input: ContractParamLike) {
    if (typeof input !== "object") {
      throw new Error(
        "Please provide an object for constructing ContractParam."
      );
    }

    if (input instanceof ContractParam) {
      this.type = input.type;
      this.value = input.value;
      return;
    }

    if (input.type === undefined) {
      throw new Error("Please provide a type for ContractParam.");
    }

    this.type = parseEnum(input.type, ContractParamType);
    const arg = input.value;
    switch (this.type) {
      case ContractParamType.Boolean:
        if (typeof arg === "boolean") {
          this.value = arg;
          return;
        } else {
          throw new Error("Please provide a boolean for value!");
        }

      case ContractParamType.ByteArray:
      case ContractParamType.Hash160:
      case ContractParamType.PublicKey:
        if (arg instanceof HexString) {
          this.value = arg;
          return;
        } else {
          throw new Error("Please provide a HexString for value!");
        }

      case ContractParamType.Integer:
      case ContractParamType.String:
        if (typeof arg === "string") {
          this.value = arg;
          return;
        } else {
          throw new Error("Please provide a string for value!");
        }

      case ContractParamType.Array:
        if (Array.isArray(arg)) {
          this.value = (arg as (
            | ContractParam
            | ContractParamLike
          )[]).map((i: ContractParam | ContractParamLike) =>
            ContractParam.fromJson(i)
          );
          return;
        } else {
          throw new Error("Please provide an array for value!");
        }

      case ContractParamType.Void:
        if (arg === null || arg === undefined) {
          this.value = null;
          return;
        } else {
          throw new Error("Void should not have any value provided.");
        }

      default:
        throw new Error(`${this.type} not supported!`);
    }
  }

  public get [Symbol.toStringTag](): string {
    return "ContractParam:" + ContractParamType[this.type];
  }

  /**
   * Creates a ContractParam from a JSON representation. Use this as the main entry point for conversion from external systems.
   * @param json - JSON format
   */
  public static fromJson(json: ContractParamLike): ContractParam {
    if (json instanceof ContractParam) {
      return new ContractParam(json);
    }
    const type = parseEnum(json.type, ContractParamType);
    const arg = json.value;
    switch (type) {
      case ContractParamType.Array:
        if (Array.isArray(arg)) {
          return ContractParam.array(...arg);
        }
        break;
      case ContractParamType.Boolean:
        if (
          typeof arg === "string" ||
          typeof arg === "number" ||
          typeof arg === "boolean"
        ) {
          return ContractParam.boolean(arg);
        }
        break;

      case ContractParamType.ByteArray:
        if (typeof arg === "string" || arg instanceof HexString) {
          return ContractParam.byteArray(arg);
        }
        break;

      case ContractParamType.Hash160:
        if (typeof arg === "string" || arg instanceof HexString) {
          return ContractParam.hash160(arg);
        }
        break;

      case ContractParamType.Integer:
        if (typeof arg === "string" || typeof arg === "number") {
          return ContractParam.integer(arg);
        }
        break;

      case ContractParamType.PublicKey:
        if (typeof arg === "string") {
          return ContractParam.publicKey(arg);
        }
        break;

      case ContractParamType.String:
        if (typeof arg === "string") {
          return ContractParam.string(arg);
        }
        break;

      case ContractParamType.Void:
        return ContractParam.void();
      default:
        throw new Error(`${ContractParamType[type]} not supported!`);
    }
    throw new Error(`got ${typeof arg} which is not convertable to ${type}`);
  }

  public export(): ContractParamJson {
    return this.toJson();
  }

  /**
   * Converts the object to JSON format.
   */
  public toJson(): ContractParamJson {
    switch (this.type) {
      case ContractParamType.Void:
        return { type: ContractParamType[this.type], value: null };
      case ContractParamType.ByteArray:
      case ContractParamType.Hash160:
      case ContractParamType.Hash256:
      case ContractParamType.PublicKey:
        return {
          type: ContractParamType[this.type],
          value: (this.value as HexString).toBigEndian(),
        };

      case ContractParamType.Array:
        return {
          type: ContractParamType[this.type],
          value: (this.value as ContractParam[]).map((cp) => cp.toJson()),
        };
      case ContractParamType.Boolean:
        return {
          type: ContractParamType[this.type],
          value: this.value as boolean,
        };
      case ContractParamType.Integer:
      case ContractParamType.String:
      case ContractParamType.Signature:
      case ContractParamType.Any:
        return {
          type: ContractParamType[this.type],
          value: this.value as string,
        };

      default:
        //TODO: Support Map and Interop
        throw new Error("Unsupported!");
    }
  }

  /**
   * Compares whether the other object is equal in value.
   * @param other - ContractParam or the JSON format.
   */
  public equals(other: ContractParamLike): boolean {
    if (this.type === parseEnum(other.type, ContractParamType)) {
      switch (this.type) {
        case ContractParamType.Array:
        case ContractParamType.Map:
          if (
            Array.isArray(this.value) &&
            Array.isArray(other.value) &&
            this.value.length === other.value.length
          ) {
            return this.value.every((cp, i) =>
              cp.equals((other.value as ContractParamLike[])[i])
            );
          }
          return false;
        case ContractParamType.ByteArray:
        case ContractParamType.Hash160:
        case ContractParamType.Hash256:
        case ContractParamType.PublicKey:
          if (
            other.value instanceof HexString ||
            typeof other.value === "string"
          ) {
            return (this.value as HexString).equals(other.value);
          }
          return false;
        case ContractParamType.Integer:
          if (typeof other.value === "number") {
            return this.value === other.value.toString();
          }
          if (typeof other.value === "string") {
            return this.value === other.value;
          }
          return false;
        case ContractParamType.Void:
          return true;
        default:
          return this.value === other.value;
      }
    }
    return false;
  }
}

export default ContractParam;

export function likeContractParam(
  cp: Partial<ContractParamLike>
): cp is ContractParamLike {
  if (cp === null || cp === undefined) {
    return false;
  }
  if (cp instanceof ContractParam) {
    return true;
  }
  return (
    cp.type !== undefined &&
    cp.type in ContractParamType &&
    cp.value !== null &&
    cp.value !== undefined
  );
}
