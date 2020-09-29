import { OpCode } from "./OpCode";
import { StringStream, isHex, reverseHex, Fixed8 } from "../u";
import { OpCodeAnnotations } from "./OpCodeAnnotations";

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
      return opToken.params
        ? Fixed8.fromReverseHex(opToken.params).toRawNumber().toNumber()
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
}

type ParamsExtracter = (script: StringStream) => string;

function readParams(bytesToRead: number): ParamsExtracter {
  return (script: StringStream): string => script.read(bytesToRead);
}

function readParamsWithPrefix(bytesToRead: number): ParamsExtracter {
  return (script: StringStream): string =>
    script.read(parseInt(reverseHex(script.read(bytesToRead)), 16));
}
