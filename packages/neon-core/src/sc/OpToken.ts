import { OpCode } from "./OpCode";
import { OpCodeAnnotations } from "./OpCodeAnnotations";
import { BigInteger, StringStream, isHex, HexString } from "../u";

// Number of bytes to read off when reading params for PUSHINT*
const PUSHINT_BYTES = [1, 2, 4, 8, 16, 32];

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
 * console.log(result[0].prettyPrint()); // SYSCALL 01020304
 */
export class OpToken {
  /**
   * Tokenizes a VM script into its individual instructions.
   * @param script - VM script to tokenize.
   */
  public static fromScript(script: string): OpToken[] {
    if (!isHex(script)) {
      throw new Error(
        `Expected a hexstring but got ${
          script.length > 20 ? script.substr(0, 20) + "..." : script
        }`
      );
    }
    const ss = new StringStream(script);
    const operations: OpToken[] = [];
    while (!ss.isEmpty()) {
      const hexOpCode = ss.read(1);
      const opCode = parseInt(hexOpCode, 16) as OpCode;
      const annotation = OpCodeAnnotations[opCode];
      const paramsExtracter = annotation.operandSize
        ? readParams(annotation.operandSize)
        : annotation.operandSizePrefix
        ? readParamsWithPrefix(annotation.operandSizePrefix)
        : () => undefined;
      operations.push(new OpToken(opCode, paramsExtracter(ss)));
    }
    return operations;
  }

  /**
   * Attempts to convert a OpToken that is parsable to an integer.
   * @param opToken - token with code that is a PUSHINT[0-9]+ or PUSH[0-9]+.
   *
   * @throws Error if OpToken contains an invalid code.
   */
  public static parseInt(opToken: OpToken): number {
    if (opToken.code >= 0 && opToken.code <= 5) {
      //PUSHINT*
      // We dont verify the length of the params. Its screwed if its wrong
      const charactersToRead = PUSHINT_BYTES[opToken.code] * 2;
      return opToken.params
        ? parseInt(
            BigInteger.fromTwos(
              opToken.params.substr(0, charactersToRead),
              true
            ).toString()
          )
        : 0;
    } else if (opToken.code >= 0x0f && opToken.code <= 0x20) {
      return opToken.code - 16;
    } else {
      throw new Error("given OpToken isnt a parsable integer.");
    }
  }

  /**Creates the OpToken for pushing a variable number onto the stack. */
  public static forInteger(n: number | string | BigInteger): OpToken {
    const i = n instanceof BigInteger ? n : BigInteger.fromNumber(n);
    if (n === -1) {
      return new OpToken(OpCode.PUSHM1);
    }
    if (i.compare(0) >= 0 && i.compare(16) <= 0) {
      return new OpToken(OpCode.PUSH0 + parseInt(i.toString()));
    }
    const twos = i.toReverseTwos();
    if (twos.length <= 2) {
      return new OpToken(OpCode.PUSHINT8, twos.padEnd(2, "0"));
    } else if (twos.length <= 4) {
      return new OpToken(OpCode.PUSHINT16, twos.padEnd(4, "0"));
    } else if (twos.length <= 8) {
      return new OpToken(OpCode.PUSHINT32, twos.padEnd(8, "0"));
    } else if (twos.length <= 16) {
      return new OpToken(OpCode.PUSHINT64, twos.padEnd(16, "0"));
    } else if (twos.length <= 32) {
      return new OpToken(OpCode.PUSHINT128, twos.padEnd(32, "0"));
    } else {
      throw new Error("Number out of range");
    }
  }

  constructor(public code: OpCode, public params?: string) {}

  /**
   * Helps to print the token in a formatted way.
   *
   * @remarks
   * Longest OpCode is 12 characters long so default padding is set to 12 characters.
   * This padding does not include an mandatory space between the OpCode and parameters.
   * Padding only happens to instructions with parameters.
   *
   * @example
   * ```
   * const script = "210c0500000000014101020304"
   * console.log(OpToken.fromScript(script).map(t => t.prettyPrint()));
   * //NOP
   * //PUSHDATA1     0000000001
   * //SYSCALL       01020304
   *
   * console.log(OpToken.fromScript(script).map(t => t.prettyPrint(8))); //underpad
   * //NOP
   * //PUSHDATA1 0000000001
   * //SYSCALL  01020304
   * ```
   */
  public prettyPrint(padding = 12): string {
    return `${
      this.params
        ? OpCode[this.code].padEnd(padding) + " " + this.params
        : OpCode[this.code]
    }`;
  }

  /**
   * Converts an OpToken back to hexstring.
   */
  public toScript(): string {
    const opCodeHex = HexString.fromNumber(this.code).toLittleEndian();
    const params = this.params ?? "";
    const annotation = OpCodeAnnotations[this.code];

    // operandSizePrefix indicates how many variable bytes after the OpCode to read.
    if (annotation.operandSizePrefix) {
      const sizeByte = HexString.fromNumber(params.length / 2).toLittleEndian();

      if (sizeByte.length / 2 > annotation.operandSizePrefix) {
        const maxExpectedSize = Math.pow(2, annotation.operandSizePrefix * 8);
        throw new Error(
          `Expected params to be less than ${maxExpectedSize} but got ${
            params.length / 2
          }`
        );
      }

      return (
        opCodeHex +
        sizeByte.padEnd(annotation.operandSizePrefix * 2, "0") +
        params
      );
    }

    // operandSize indicates how many bytes after the OpCode to read.
    if (annotation.operandSize) {
      if (params.length / 2 !== annotation.operandSize) {
        throw new Error(
          `Expected params to be ${annotation.operandSize} bytes long but got ${
            params.length / 2
          } instead.`
        );
      }
    }

    return opCodeHex + params;
  }
}

type ParamsExtracter = (script: StringStream) => string;

function readParams(bytesToRead: number): ParamsExtracter {
  return (script: StringStream): string => script.read(bytesToRead);
}

function readParamsWithPrefix(bytesToRead: number): ParamsExtracter {
  return (script: StringStream): string =>
    script.read(HexString.fromHex(script.read(bytesToRead), true).toNumber());
}
