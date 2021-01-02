import BN from "bn.js";
import {
  ab2hexstring,
  num2hexstring,
  str2hexstring,
  StringStream,
  int2hex,
  HexString,
} from "../u";
import {
  ContractParam,
  ContractParamType,
  likeContractParam,
} from "./ContractParam";
import { OpCode } from "./OpCode";
import { InteropServiceCode } from "./InteropServiceCode";
import { ContractCall, ContractCallJson } from "./types";
import { TextEncoder as textEncoderNode10 } from "util";
/**
 * Builds a VM script in hexstring. Used for constructing smart contract method calls.
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

  /**
   * Appends a script that calls an operation on a smart contract.
   * @param scriptHash - ScriptHash of the contract to call.
   * @param operation - The operation to call as a UTF8 string.
   * @param args - Any arguments to pass to the operation.
   *
   * @deprecated Please use emitContractCall which is better typed.
   */
  public emitAppCall(
    scriptHash: string | HexString,
    operation: string,
    args: unknown[] = []
  ): this {
    if (args.length === 0) {
      this.emit(OpCode.NEWARRAY0);
    } else {
      for (let i = args.length - 1; i >= 0; i--) {
        this.emitPush(args[i]);
      }
      this.emitNumber(args.length);
      this.emit(OpCode.PACK);
    }

    return this.emitString(operation)
      .emitHexString(HexString.fromHex(scriptHash))
      .emitSysCall(InteropServiceCode.SYSTEM_CONTRACT_CALL);
  }

  public emitSysCall(service: InteropServiceCode, ...args: unknown[]): this {
    for (let i = args.length - 1; i >= 0; i--) {
      this.emitPush(args[i]);
    }
    return this.emit(OpCode.SYSCALL, service);
  }

  /**
   * Appends data depending on type. Used to append params/array lengths.
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
        } else if (data instanceof HexString) {
          return this.emitHexString(data);
        } else if (data === null) {
          return this.emitPush(false);
        } else if (likeContractParam(data)) {
          return this.emitContractParam(ContractParam.fromJson(data));
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
   */
  private emitArray(arr: unknown[]): this {
    for (let i = arr.length - 1; i >= 0; i--) {
      this.emitPush(arr[i]);
    }
    return this.emitNumber(arr.length).emit(OpCode.PACK);
  }

  /**
   * Appends a bytearray.
   */
  public emitBytes(byteArray: ArrayBuffer | ArrayLike<number>): this {
    return this.emitHexString(HexString.fromArrayBuffer(byteArray, true));
  }

  /**
   * Appends a UTF-8 string.
   */
  public emitString(str: string): this {
    const encoder =
      typeof TextEncoder !== "undefined"
        ? new TextEncoder()
        : new textEncoderNode10();
    const bytes = encoder.encode(str);
    return this.emitBytes(bytes);
  }

  /**
   * Appends a hexstring.
   *
   * @remarks
   * If a Javascript string is provided, it is emitted as it is.
   * If a HexString is provided, it is emitted as little-endian.
   */
  public emitHexString(hexstr: string | HexString): this {
    if (typeof hexstr === "string") {
      hexstr = HexString.fromHex(hexstr, true);
    }
    const littleEndianHex = hexstr.toLittleEndian();
    const size = hexstr.byteLength;
    if (size < 0x100) {
      return this.emit(OpCode.PUSHDATA1, num2hexstring(size) + littleEndianHex);
    } else if (size < 0x10000) {
      return this.emit(
        OpCode.PUSHDATA2,
        num2hexstring(size, 2, true) + littleEndianHex
      );
    } else if (size < 0x100000000) {
      return this.emit(
        OpCode.PUSHDATA4,
        num2hexstring(size, 4, true) + littleEndianHex
      );
    } else {
      throw new Error(`Data too big to emit!`);
    }
  }

  /**
   * Helper method to emit a public key.
   *
   * @remarks
   * Conventionally, hexstrings are pushed as little endian into the script. However, for public keys, they are pushed as big endian.
   * This helper method reduces the confusion by hiding this edge case.
   * @param publicKey - 66 character string or a HexString.
   *
   * @example
   * const publicKey = "02028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef";
   * const result = new ScriptBuilder()
   *  .emitPublicKey(publicKey)
   *  .build();
   *
   * const publicKeyInHexString = HexString.fromHex(publicKey, false);
   * const sameResult = new ScriptBuilder()
   *  .emitPublicKey(publicKeyInHexString)
   *  .build();
   *
   * console.log(result); // 0c2102028a99826edc0c97d18e22b6932373d908d323aa7f92656a77ec26e8861699ef
   *
   *
   */
  public emitPublicKey(publicKey: string | HexString): this {
    const stringFormatKey =
      publicKey instanceof HexString ? publicKey.toBigEndian() : publicKey;
    return this.emit(OpCode.PUSHDATA1, num2hexstring(33) + stringFormatKey);
  }

  /**
   * Appends a number. Maximum number possible is ulong(256 bits of data).
   * @param num - for numbers beyond MAX_INT, please pass in a string instead of a javascript number.
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
    if (param.type === undefined) {
      throw new Error("No type available!");
    }
    switch (param.type) {
      case ContractParamType.Any:
        if (param.value === null) {
          return this.emit(OpCode.PUSHNULL);
        }
        return this.emitHexString(
          (param.value as string | HexString | null) ?? ""
        );
      case ContractParamType.String:
        return this.emitString(str2hexstring(param.value as string));
      case ContractParamType.Boolean:
        return this.emitBoolean(param.value as boolean);
      case ContractParamType.Integer:
        return this.emitNumber(param.value as number | string);
      case ContractParamType.ByteArray:
        return this.emitHexString(param.value as string);
      case ContractParamType.Array:
        return this.emitArray(param.value as ContractParam[]);
      case ContractParamType.Hash160:
      case ContractParamType.Hash256:
        return this.emitHexString(param.value as HexString);
      case ContractParamType.PublicKey:
        return this.emitPublicKey(param.value as HexString);
      default:
        throw new Error(`Unaccounted ContractParamType!: ${param.type}`);
    }
  }

  /**
   * Appends a script that calls an operation on a smart contract.
   * @param contractCall - A ContractCall object emitted from a Contract instance.
   */
  public emitContractCall(contractCall: ContractCall | ContractCallJson): this {
    return this.emitAppCall(
      contractCall.scriptHash,
      contractCall.operation,
      contractCall.args
    );
  }
}

export default ScriptBuilder;
