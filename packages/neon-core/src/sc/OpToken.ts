import OpCode from "./OpCode";
import { StringStream } from "../u";

export class OpToken {
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

  constructor(public code: OpCode, public params?: string) {}

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

type PushConstOpCode =
  | OpCode.PUSHNULL
  | OpCode.PUSHM1
  | OpCode.PUSH0
  | OpCode.PUSH1;

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
