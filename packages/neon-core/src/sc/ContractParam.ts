import { BigInteger, HexString } from "../u";
import { getScriptHashFromAddress, isAddress, isPublicKey } from "../wallet";
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
  Signature = 0x17, // TODO: Implement support

  Array = 0x20,
  Map = 0x22, // TODO: Implement support

  InteropInterface = 0x30, // TODO: Implement support

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
  public static any(value: string | HexString | null = null): ContractParam {
    return new ContractParam({
      type: ContractParamType.Any,
      value,
    });
  }

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

  /**
   * Creates a PublicKey ContractParam. Both encoding formats are allowed. Value field will be a HexString.
   * @param value - A public key (both encoding formats accepted)
   */
  public static publicKey(value: string | HexString): ContractParam {
    const stringValue =
      value instanceof HexString ? value.toBigEndian() : value;
    if (!isPublicKey(stringValue)) {
      throw new Error(
        `publicKey expected valid public key but got ${stringValue}`
      );
    }
    return new ContractParam({
      type: ContractParamType.PublicKey,
      value: HexString.fromHex(stringValue),
    });
  }

  /**
   * Creates a Hash160 ContractParam. This is used for containing a scriptHash. Value field will be a HexString.
   * Do not reverse the input if using this format.
   * @param value - A 40 character (20 bytes) hexstring. Automatically converts an address to scripthash if provided.
   */
  public static hash160(value: string | HexString): ContractParam {
    const hexStringValue =
      value instanceof HexString
        ? value
        : HexString.fromHex(
            isAddress(value) ? getScriptHashFromAddress(value) : value
          );
    if (hexStringValue.byteLength !== 20) {
      throw new Error(
        `hash160 expected 20 bytes but got ${hexStringValue.byteLength} bytes instead.`
      );
    }
    return new ContractParam({
      type: ContractParamType.Hash160,
      value: hexStringValue,
    });
  }

  /**
   * Creates a Hash256 ContractParam. Value field will be a HexString.s
   * @param value - A 64 character (32 bytes) hexstring .
   */
  public static hash256(value: string | HexString): ContractParam {
    const hexStringValue =
      value instanceof HexString ? value : HexString.fromHex(value);
    if (hexStringValue.byteLength !== 32) {
      throw new Error(
        `hash256 expected 32 bytes but got ${hexStringValue.byteLength} bytes instead.`
      );
    }
    return new ContractParam({
      type: ContractParamType.Hash256,
      value: hexStringValue,
    });
  }

  /**
   * Creates an Integer ContractParam. This is converted into a BigInteger in NeoVM. Value field will be a string.
   * @param value - A value that can be parsed to a BigInteger. Numbers or numeric strings are accepted.

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
   * @param value - a base64 encoded string (LE) or HexString.
   */
  public static byteArray(value: string | HexString): ContractParam {
    if (typeof value === "string") {
      return new ContractParam({
        type: ContractParamType.ByteArray,
        value: HexString.fromBase64(value, true),
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
      case ContractParamType.Any:
        if (arg instanceof HexString) {
          this.value = arg.toBigEndian();
          return;
        } else if (typeof arg === "string" || arg === null) {
          this.value = arg;
          return;
        } else {
          throw new Error("Please provide a hexstring for value!");
        }
      case ContractParamType.Boolean:
        if (typeof arg === "boolean") {
          this.value = arg;
          return;
        } else {
          throw new Error("Please provide a boolean for value!");
        }

      case ContractParamType.ByteArray:
      case ContractParamType.Hash160:
      case ContractParamType.Hash256:
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
          this.value = (arg as (ContractParam | ContractParamLike)[]).map(
            (i: ContractParam | ContractParamLike) => ContractParam.fromJson(i)
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
        throw new Error(`${ContractParamType[this.type]} not supported!`);
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
      case ContractParamType.Any:
        if (
          typeof arg === "string" ||
          arg instanceof HexString ||
          arg === null ||
          arg === undefined
        ) {
          return ContractParam.any(arg);
        }
        break;
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

      case ContractParamType.Hash256:
        if (typeof arg === "string" || arg instanceof HexString) {
          return ContractParam.hash256(arg);
        }
        break;

      case ContractParamType.PublicKey:
        if (typeof arg === "string" || arg instanceof HexString) {
          return ContractParam.publicKey(arg);
        }
        break;

      case ContractParamType.Integer:
        if (typeof arg === "string" || typeof arg === "number") {
          return ContractParam.integer(arg);
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
    throw new Error(
      `got ${typeof arg} which is not convertable to ${ContractParamType[type]}`
    );
  }

  public export(): ContractParamJson {
    return this.toJson();
  }

  /**
   * Converts the object to JSON format.
   */
  public toJson(): ContractParamJson {
    switch (this.type) {
      case ContractParamType.Any:
        return {
          type: ContractParamType[this.type],
          value:
            this.value instanceof HexString
              ? this.value.toBigEndian()
              : (this.value as string | null | undefined),
        };
      case ContractParamType.Void:
        return { type: ContractParamType[this.type], value: null };

      case ContractParamType.ByteArray:
        return {
          type: ContractParamType[this.type],
          value: (this.value as HexString).toBase64(true),
        };
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
        return {
          type: ContractParamType[this.type],
          value: this.value as string,
        };

      default:
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

        case ContractParamType.Boolean:
        case ContractParamType.String:
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
  return cp.type !== undefined && cp.type in ContractParamType;
}
