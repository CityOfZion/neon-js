import { Fixed8, reverseHex, HexString } from "../u";
import { getScriptHashFromAddress, isAddress } from "../wallet";
import { NeonObject } from "../model";

export enum ContractParamType {
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
  Any = 0xfe,
  Void = 0xff,
}

export interface ContractParamLike {
  type: string;
  value: string | boolean | number | ContractParamLike[] | null;
}

function toContractParamType(
  type: ContractParamType | string | number
): ContractParamType {
  if (typeof type === "string") {
    if (type in ContractParamType) {
      return ContractParamType[type as keyof typeof ContractParamType];
    }
    throw new Error(`${type} not found in ContractParamType!`);
  }
  return type;
}

/**
 * Contract input parameters.
 * These are mainly used as parameters to pass in for RPC test invokes.
 */
export class ContractParam implements NeonObject<ContractParamLike> {
  /**
   * Creates a String ContractParam.
   */
  public static string(value: string): ContractParam {
    return new ContractParam({
      type: ContractParamType.String,
      value,
    });
  }

  /**
   * Creates a Boolean ContractParam. Does basic checks to convert value into a boolean.
   */
  public static boolean(
    value: boolean | string | number | object
  ): ContractParam {
    return new ContractParam({
      type: ContractParamType.Boolean,
      value: !!value,
    });
  }

  public static publicKey(value: string): ContractParam {
    return new ContractParam({ type: ContractParamType.PublicKey, value });
  }

  /**
   * Creates a Hash160 ContractParam. This is used for containing a scriptHash. Do not reverse the input if using this format.
   * @param {string} value - A 40 character long hexstring. Automatically converts an address to scripthash if provided.
   * @return {ContractParam}
   */
  public static hash160(value: string): ContractParam {
    if (isAddress(value)) {
      value = getScriptHashFromAddress(value);
    }
    if (value.length !== 40) {
      throw new Error(
        `hash160 expected a 40 character string but got ${value.length} chars instead.`
      );
    }
    return new ContractParam({ type: ContractParamType.Hash160, value });
  }

  /**
   * Creates an Integer ContractParam. This is converted into an BigInteger in NeoVM.
   * @param {string | number } value - A value that can be parsed to an BigInteger. Numbers or numeric strings are accepted.
   * @example
   * ContractParam.integer(128)
   * ContractParam.integer("128")
   */
  public static integer(value: string | number): ContractParam {
    const num =
      typeof value === "string"
        ? value.split(".")[0]
        : Math.round(value).toString();
    return new ContractParam({
      type: ContractParamType.Integer,
      value: num,
    });
  }

  /**
   * Creates a ByteArray ContractParam.
   * @param value
   * @param format The format that this value represents. Different formats are parsed differently.
   * @param args Additional arguments such as decimal precision
   */
  public static byteArray(
    value: string | number,
    format: string,
    ...args: unknown[]
  ): ContractParam {
    if (format) {
      format = format.toLowerCase();
    }
    if (format === "address") {
      if (typeof value !== "string") {
        throw new Error("Expected string when format is address");
      }
      return new ContractParam({
        type: ContractParamType.ByteArray,
        value: reverseHex(getScriptHashFromAddress(value)),
      });
    } else if (format === "fixed8") {
      let decimals = 8;
      if (args.length === 1) {
        if (typeof args[0] !== "number") {
          throw new Error("Expected number when format is fixed8");
        }
        decimals = args[0];
      }
      if (typeof value !== "number" || !isFinite(value)) {
        throw new Error(`Input should be number!`);
      }
      const divisor = new Fixed8(Math.pow(10, 8 - decimals));
      const fixed8Value = new Fixed8(value);
      const adjustedValue = fixed8Value.times(Math.pow(10, decimals));
      const modValue = adjustedValue.mod(1);
      if (!modValue.isZero()) {
        throw new Error(`wrong precision: expected ${decimals}`);
      }
      const finalValue = fixed8Value.div(divisor);
      return new ContractParam({
        type: ContractParamType.ByteArray,
        value: finalValue.toReverseHex().slice(0, 16),
      });
    } else {
      return new ContractParam({ type: ContractParamType.ByteArray, value });
    }
  }

  /**
   * Creates an Array ContractParam.
   * @param params params to be encapsulated in an array.
   */
  public static array(...params: ContractParam[]): ContractParam {
    return new ContractParam({ type: ContractParamType.Array, value: params });
  }

  public type: ContractParamType;
  public value: string | boolean | number | HexString | ContractParam[] | null;

  public constructor(input: Partial<ContractParamLike | ContractParam>) {
    if (typeof input === "object") {
      if (input.type === undefined) {
        throw new Error("type must be defined!");
      }
      this.type = toContractParamType(input.type);
      if (this.type !== ContractParamType.Void && input.value === undefined) {
        throw new Error("value must be defined!");
      }
      switch (this.type) {
        case ContractParamType.Array:
          this.value = (input.value as (
            | ContractParamLike
            | ContractParam
          )[]).map((cp) => new ContractParam(cp));
          return;
        case ContractParamType.Boolean:
          this.value = !!input.value;
          return;
        case ContractParamType.Hash160:
        case ContractParamType.Hash256:
        case ContractParamType.PublicKey:
          this.value = HexString.fromHex(input.value as string);
        case ContractParamType.Integer:
        case ContractParamType.String:
          this.value = input.value as number | string;
        case ContractParamType.Any:
          this.value =
            typeof input.value === "object"
              ? (input.value as (ContractParamLike | ContractParam)[]).map(
                  (cp) => new ContractParam(cp)
                )
              : input.value ?? null;
          return;
      }
      this.value =
        typeof input.value === "object"
          ? (input.value as (ContractParamLike | ContractParam)[]).map(
              (cp) => new ContractParam(cp)
            )
          : input.value ?? null;
    } else {
      throw new Error("No constructor arguments provided!");
    }
  }

  public get [Symbol.toStringTag](): string {
    return "ContractParam:" + ContractParamType[this.type];
  }

  public export(): ContractParamLike {
    switch (this.type) {
      case ContractParamType.Void:
        return { type: ContractParamType[this.type], value: null };
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
          value: (this.value as ContractParam[]).map((cp) => cp.export()),
        };
      case ContractParamType.Boolean:
        return {
          type: ContractParamType[this.type],
          value: this.value as boolean,
        };
      case ContractParamType.Integer:
        return {
          type: ContractParamType[this.type],
          value: this.value as number,
        };
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

  public equals(other: ContractParamLike): boolean {
    if (this.type === toContractParamType(other.type)) {
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
  cp: Partial<ContractParamLike | ContractParam>
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
