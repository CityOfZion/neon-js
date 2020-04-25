import BN from "bn.js";
import {
  ab2hexstring,
  num2hexstring,
  reverseHex,
  str2hexstring,
  StringStream,
  Fixed8,
  int2hex,
  ensureHex
} from "../u";
import ContractParam, {
  ContractParamType,
  likeContractParam
} from "./ContractParam";
import { OpCode } from "./OpCode";
import InteropServiceCode from "./InteropServiceCode";

export interface ScriptIntent {
  scriptHash: string | "NEO" | "GAS" | "POLICY";
  operation?: string;
  args?: unknown[];
}

export interface ScriptResult {
  hex: string;
  fee: Fixed8;
}

/**
 * Builds a VM script in hexstring. Used for constructing smart contract method calls.
 * @extends StringStream
 */
export class ScriptBuilder extends StringStream {
  /**
   * Returns a copy of the script.
   */
  public build(): string {
    return this.str.slice(0);
  }
  /**
   * Appends an Opcode, followed by args
   */
  public emit(op: OpCode, args?: string): this {
    this.str += int2hex(op);
    if (args) {
      this.str += args;
    }
    return this;
  }

  public emitAppCall(
    _scriptHash: string,
    _operation?: string,
    _args?: unknown[]
  ): this {
    throw new Error("TO BE DELETED");
  }

  public emitSysCall(service: InteropServiceCode, ...args: unknown[]): this {
    for (let i = args.length - 1; i >= 0; i--) {
      this.emitPush(args[i]);
    }
    return this.emit(OpCode.SYSCALL, service);
  }

  /**
   * Appends data depending on type. Used to append params/array lengths.
   * @param data
   * @return this
   */
  public emitPush(data: unknown): this {
    switch (typeof data) {
      case "boolean":
        return this.emitBoolean(data as boolean);
      case "string":
        return this.emitString(data as string);
      case "number":
        return this.emitNumber(data as number);
      case "undefined":
        return this.emitPush(false);
      case "object":
        if (Array.isArray(data)) {
          return this.emitArray(data);
        } else if (data === null) {
          return this.emitPush(false);
        } else if (likeContractParam(data)) {
          return this.emitContractParam(new ContractParam(data));
        }
        throw new Error(`Unidentified object: ${data}`);
      default:
        throw new Error();
    }
  }

  //TODO: Add EmitJump

  //TODO: Add EmitCall(offset)

  public emitBoolean(bool: boolean): this {
    return this.emit(bool ? OpCode.PUSH1 : OpCode.PUSH0);
  }

  /**
   * Private method to append an array
   * @private
   */
  private emitArray(arr: unknown[]): this {
    for (let i = arr.length - 1; i >= 0; i--) {
      this.emitPush(arr[i]);
    }
    return this.emitPush(arr.length).emit(OpCode.PACK);
  }

  /**
   * Appends a bytearray.
   */
  public emitBytes(byteArray: ArrayBuffer | ArrayLike<number>): this {
    return this.emitHexstring(ab2hexstring(byteArray));
  }

  /**
   * Appends a UTF-8 string.
   */
  public emitString(str: string): this {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    return this.emitBytes(bytes);
  }

  /**
   * Appends a hexstring.
   */
  public emitHexstring(hexstr: string): this {
    ensureHex(hexstr);
    const size = hexstr.length / 2;
    if (size < 0x100) {
      return this.emit(OpCode.PUSHDATA1, num2hexstring(size) + hexstr);
    } else if (size < 0x10000) {
      return this.emit(OpCode.PUSHDATA2, num2hexstring(size, 2, true) + hexstr);
    } else if (size < 0x100000000) {
      return this.emit(OpCode.PUSHDATA4, num2hexstring(size, 4, true) + hexstr);
    } else {
      throw new Error(`Data too big to emit!`);
    }
  }

  /**
   * Appends a number. Maximum number possible is ulong(256 bits of data).
   * @param num For numbers beyond MAX_INT, please pass in a string instead of a javascript number.
   * @return this
   */
  public emitNumber(num: number | string): this {
    const bn = new BN(num, 10, "be");
    if (bn.gten(-1) && bn.lten(16)) {
      return this.emit(OpCode.PUSH0 + bn.toNumber());
    }
    const negative = bn.isNeg();
    const msbSet = bn.testn(bn.byteLength() * 8 - 1);
    const occupiedBytes = bn.byteLength();
    const targetBytes = this.roundToBestIntSize(
      !negative && msbSet ? occupiedBytes + 1 : occupiedBytes
    );

    // Catch case 64
    if (targetBytes > 32) {
      throw new Error(`Number too long to be emitted: ${num.toString()}`);
    }

    const hex = ab2hexstring(
      bn.toTwos(bn.byteLength() * 8).toArray("le", targetBytes)
    );

    switch (targetBytes) {
      case 1:
        return this.emit(OpCode.PUSHINT8, hex);
      case 2:
        return this.emit(OpCode.PUSHINT16, hex);
      case 4:
        return this.emit(OpCode.PUSHINT32, hex);
      case 8:
        return this.emit(OpCode.PUSHINT64, hex);
      case 16:
        return this.emit(OpCode.PUSHINT128, hex);
      case 32:
        return this.emit(OpCode.PUSHINT256, hex);
      default:
        // Will not reach
        throw new Error();
    }
  }

  private roundToBestIntSize(n: number): 1 | 2 | 4 | 8 | 16 | 32 | 64 {
    switch (true) {
      case n == 1:
        return 1;
      case n == 2:
        return 2;
      case n <= 4:
        return 4;
      case n <= 8:
        return 8;
      case n <= 16:
        return 16;
      case n <= 32:
        return 32;
      default:
        return 64;
    }
  }

  /**
   * Private method to append a ContractParam
   */
  public emitContractParam(param: ContractParam): this {
    if (!param.type) {
      throw new Error("No type available!");
    }
    switch (param.type) {
      case ContractParamType.String:
        return this.emitString(str2hexstring(param.value as string));
      case ContractParamType.Boolean:
        return this.emitBoolean(param.value as boolean);
      case ContractParamType.Integer:
        return this.emitNumber(param.value as number | string);
      case ContractParamType.ByteArray:
        return this.emitString(param.value as string);
      case ContractParamType.Array:
        return this.emitArray(param.value as ContractParam[]);
      case ContractParamType.Hash160:
        return this.emitHexstring(reverseHex(param.value as string));
      case ContractParamType.PublicKey:
        return this.emitHexstring(param.value as string);
      default:
        throw new Error(`Unaccounted ContractParamType!: ${param.type}`);
    }
  }
}

export default ScriptBuilder;
