/* eslint-disable @typescript-eslint/no-non-null-assertion */
import BN from "bn.js";
import {
  ensureHex,
  int2hex,
  num2hexstring,
  reverseHex,
  str2hexstring,
  StringStream,
} from "../u";
import ContractParam, {
  ContractParamLike,
  ContractParamType,
  likeContractParam,
} from "./ContractParam";
import OpCode from "./OpCode";

export interface ScriptIntent {
  scriptHash: string;
  operation?: string;
  args?: any[];
  useTailCall?: boolean;
}

function isValidValue(value: any): boolean {
  if (value) {
    return true;
  } else if (value === 0) {
    return true;
  } else if (value === "") {
    return true;
  } else if (value === false) {
    return true;
  }
  return false;
}

/**
 * Retrieves a single AppCall from a ScriptBuilder object.
 * Returns ScriptIntents starting from the beginning of the script.
 * This is based off the pointer in the stream.
 * @param sb
 * @returns A single ScriptIntent if available.
 */
function retrieveAppCall(sb: ScriptBuilder): ScriptIntent | null {
  const output: ScriptIntent = {
    scriptHash: "",
    args: [],
  };

  while (!sb.isEmpty()) {
    const b = sb.read();
    const n = parseInt(b, 16);
    switch (true) {
      case n === 0:
        output.args!.unshift(0);
        break;
      case n < 75:
        output.args!.unshift(sb.read(n));
        break;
      case n >= 81 && n <= 96:
        output.args!.unshift(n - 80);
        break;
      case n === 193:
        const len = output.args!.shift();
        const cache = [];
        for (let i = 0; i < len; i++) {
          cache.unshift(output.args!.shift());
        }
        output.args!.unshift(cache);
        break;
      case n === 102:
        sb.pter = sb.str.length;
        break;
      case n === 103:
        output.scriptHash = reverseHex(sb.read(20));
        output.useTailCall = false;
        return output;
      case n === 105:
        output.scriptHash = reverseHex(sb.read(20));
        output.useTailCall = true;
        return output;
      case n === 241:
        break;
      default:
        throw new Error(`Encounter unknown byte: ${b}`);
    }
  }
  if (output.scriptHash === "") {
    return null;
  }
  return output;
}

/**
 * Builds a VM script in hexstring. Used for constructing smart contract method calls.
 * @extends StringStream
 */
export class ScriptBuilder extends StringStream {
  /**
   * Appends an Opcode, followed by args
   */
  public emit(op: OpCode, args?: string): this {
    this.str += num2hexstring(op);
    if (args) {
      this.str += args;
    }
    return this;
  }

  /**
   * Appends args, operation and scriptHash
   * @param scriptHash Hexstring(BE)
   * @param operation ASCII, defaults to null
   * @param args any
   * @param useTailCall Use TailCall instead of AppCall
   * @return this
   */
  public emitAppCall(
    scriptHash: string,
    operation: string | null = null,
    args?: any[] | string | number | boolean,
    useTailCall = false
  ): this {
    if (args !== undefined) {
      this.emitPush(args);
    }
    if (operation !== null) {
      let hexOp = "";
      for (let i = 0; i < operation.length; i++) {
        hexOp += num2hexstring(operation.charCodeAt(i));
      }
      this.emitPush(hexOp);
    }
    this._emitAppCall(scriptHash, useTailCall);
    return this;
  }

  /**
   * Appends a SysCall
   * @param api api of SysCall
   * @return this
   */
  public emitSysCall(api: string): this {
    if (!api) {
      throw new Error("Invalid SysCall API");
    }
    const apiBytes = str2hexstring(api);
    const length = int2hex(apiBytes.length / 2);
    if (length.length !== 2) {
      throw new Error("Invalid length for SysCall API");
    }
    const out = length + apiBytes;
    return this.emit(OpCode.SYSCALL, out);
  }

  /**
   * Appends data depending on type. Used to append params/array lengths.
   * @param data
   * @return this
   */
  public emitPush(data?: unknown): this {
    switch (typeof data) {
      case "boolean":
        return this.emit(data ? OpCode.PUSHT : OpCode.PUSHF);
      case "string":
        return this._emitString(data as string);
      case "number":
        return this._emitNum(data as number);
      case "undefined":
        return this.emitPush(false);
      case "object":
        if (Array.isArray(data)) {
          return this._emitArray(data);
        } else if (likeContractParam(data as Record<string, unknown>)) {
          return this._emitParam(new ContractParam(data as ContractParamLike));
        } else if (data === null) {
          return this.emitPush(false);
        }
        throw new Error(`Unidentified object: ${data}`);
      default:
        throw new Error();
    }
  }

  /**
   * Reverse engineer a script back to its params.
   * A script may have multiple invocations so a list is always returned.
   * @return A list of ScriptIntents[].
   */
  public toScriptParams(): ScriptIntent[] {
    this.reset();
    const scripts = [];
    while (!this.isEmpty()) {
      const a = retrieveAppCall(this);
      if (a) {
        scripts.push(a);
      }
    }
    return scripts;
  }

  /**
   * Appends a AppCall and scriptHash. Used to end off a script.
   * @param scriptHash Hexstring(BE)
   * @param useTailCall Defaults to false
   */
  private _emitAppCall(scriptHash: string, useTailCall = false): this {
    ensureHex(scriptHash);
    if (scriptHash.length !== 40) {
      throw new Error("ScriptHash should be 20 bytes long!");
    }
    return this.emit(
      useTailCall ? OpCode.TAILCALL : OpCode.APPCALL,
      reverseHex(scriptHash)
    );
  }

  /**
   * Private method to append an array
   * @private
   */
  private _emitArray(arr: any[]): this {
    for (let i = arr.length - 1; i >= 0; i--) {
      this.emitPush(arr[i]);
    }
    return this.emitPush(arr.length).emit(OpCode.PACK);
  }

  /**
   * Private method to append a hexstring.
   * @private
   * @param hexstring Hexstring(BE)
   * @return this
   */
  private _emitString(hexstring: string): this {
    ensureHex(hexstring);
    const size = hexstring.length / 2;
    if (size <= OpCode.PUSHBYTES75) {
      this.str += num2hexstring(size);
      this.str += hexstring;
    } else if (size < 0x100) {
      this.emit(OpCode.PUSHDATA1);
      this.str += num2hexstring(size);
      this.str += hexstring;
    } else if (size < 0x10000) {
      this.emit(OpCode.PUSHDATA2);
      this.str += num2hexstring(size, 2, true);
      this.str += hexstring;
    } else if (size < 0x100000000) {
      this.emit(OpCode.PUSHDATA4);
      this.str += num2hexstring(size, 4, true);
      this.str += hexstring;
    } else {
      throw new Error(`String too big to emit!`);
    }
    return this;
  }

  /**
   * Private method to append a number.
   * @private
   * @param num
   * @return this
   */
  private _emitNum(num: number | string): this {
    const bn = new BN(num);
    if (bn.eqn(-1)) {
      return this.emit(OpCode.PUSHM1);
    }
    if (bn.eqn(0)) {
      return this.emit(OpCode.PUSH0);
    }
    if (bn.gtn(0) && bn.lten(16)) {
      return this.emit(OpCode.PUSH1 - 1 + bn.toNumber());
    }
    const msbSet = bn.testn(bn.byteLength() * 8 - 1);

    const hex = bn
      .toTwos(bn.byteLength() * 8)
      .toString(16, bn.byteLength() * 2);
    const paddedHex = !bn.isNeg() && msbSet ? "00" + hex : hex;

    return this.emitPush(reverseHex(paddedHex));
  }

  /**
   * Private method to append a ContractParam
   * @private
   */
  private _emitParam(param: ContractParam): this {
    if (!param.type) {
      throw new Error("No type available!");
    }
    if (!isValidValue(param.value)) {
      throw new Error("Invalid value provided!");
    }
    switch (param.type) {
      case ContractParamType.String:
        return this._emitString(str2hexstring(param.value));
      case ContractParamType.Boolean:
        return this.emit(param.value ? OpCode.PUSHT : OpCode.PUSHF);
      case ContractParamType.Integer:
        return this._emitNum(param.value);
      case ContractParamType.ByteArray:
        return this._emitString(param.value);
      case ContractParamType.Array:
        return this._emitArray(param.value);
      case ContractParamType.Hash160:
        return this._emitString(reverseHex(param.value));
      default:
        throw new Error(`Unaccounted ContractParamType!: ${param.type}`);
    }
  }
}

export default ScriptBuilder;
