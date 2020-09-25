import OpCode from "./OpCode";
import { StringStream, HexString } from "../u";

/**
 * A token from tokenizing a VM script. Consists of a OpCode and optional params that follow it.
 *
 * @remarks
 * Currently, most of the functionality here deals with breaking down the script correctly to identify the parts which are data (not opCodes).
 * An extension of this would be adding an apply function which we can provide a VM context and that should give us a semi working VM.
 *
 * @example
 *
 * const result = OpToken.fromScript("4101020304");
 * console.log(result[0].toInstruction()); // SYSCALL 01020304
 */
export class OpToken {
  /**
   * Tokenizes a VM script into its individual instructions.
   * @param script - VM script to tokenize.
   */
  public static fromScript(script: string): OpToken[] {
    const ss = new StringStream(script);
    const operations: OpToken[] = [];
    while (!ss.isEmpty()) {
      const hexOpCode = ss.read(1);
      const opCode = parseInt(hexOpCode, 16) as OpCode;
      const params = hasParams(opCode) ? paramsFactory[opCode](ss) : undefined;
      operations.push(new OpToken(opCode, params));
    }
    return operations;
  }

  public static parseInt(opToken: OpToken): number {
    if (opToken.code >= 0 && opToken.code <= 5) {
      //PUSHINT*
      // We dont verify the length of the params. Its screwed if its wrong
      return opToken.params
        ? HexString.fromHex(opToken.params, true).toNumber()
        : 0;
    } else if (opToken.code >= 0x0f && opToken.code <= 0x20) {
      return opToken.code - 16;
    } else {
      throw new Error("given OpToken isnt a parsable integer.");
    }
  }

  constructor(public code: OpCode, public params?: string) {}

  /**
   * Helps to print the token in a formatted way.
   */
  public toInstruction(): string {
    return `${OpCode[this.code]}${this.params ? " " + this.params : ""}`;
  }
}

type ParamsExtracter = (script: StringStream) => string;

type PushByteOpCode =
  | OpCode.PUSHINT8
  | OpCode.PUSHINT16
  | OpCode.PUSHINT32
  | OpCode.PUSHINT64
  | OpCode.PUSHINT128
  | OpCode.PUSHINT256
  | OpCode.PUSHA
  | OpCode.PUSHDATA1
  | OpCode.PUSHDATA2
  | OpCode.PUSHDATA4;

type OpCodeWithParams = PushByteOpCode | OpCode.SYSCALL;
const paramsFactory: Record<OpCodeWithParams, ParamsExtracter> = {
  [OpCode.PUSHINT8]: (script: StringStream): string => {
    return script.read(1);
  },
  [OpCode.PUSHINT16]: (script: StringStream): string => {
    return script.read(2);
  },
  [OpCode.PUSHINT32]: (script: StringStream): string => {
    return script.read(4);
  },
  [OpCode.PUSHINT64]: (script: StringStream): string => {
    return script.read(8);
  },
  [OpCode.PUSHINT128]: (script: StringStream): string => {
    return script.read(16);
  },
  [OpCode.PUSHINT256]: (script: StringStream): string => {
    return script.read(32);
  },
  [OpCode.PUSHA]: (script: StringStream): string => {
    return script.read(4);
  },
  [OpCode.PUSHDATA1]: (script: StringStream): string => {
    const bytesToRead = script.read(1);
    const numberOfBytesToRead = parseInt(bytesToRead, 16);
    const data = script.read(numberOfBytesToRead);
    return bytesToRead + data;
  },
  [OpCode.PUSHDATA2]: (script: StringStream): string => {
    const bytesToRead = script.read(2);
    const numberOfBytesToRead = parseInt(bytesToRead, 16);
    const data = script.read(numberOfBytesToRead);
    return bytesToRead + data;
  },
  [OpCode.PUSHDATA4]: (script: StringStream): string => {
    const bytesToRead = script.read(4);
    const numberOfBytesToRead = parseInt(bytesToRead, 16);
    const data = script.read(numberOfBytesToRead);
    return bytesToRead + data;
  },
  [OpCode.SYSCALL]: (script: StringStream): string => {
    return script.read(4);
  },
};

function hasParams(opCode: OpCode): opCode is OpCodeWithParams {
  return paramsFactory.hasOwnProperty(opCode);
}
