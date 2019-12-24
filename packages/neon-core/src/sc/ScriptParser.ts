import { reverseHex, StringStream, hexstring2str } from "../u";
import { ScriptIntent } from "./ScriptBuilder";
import InteropServiceCode from "./InteropServiceCode";

/**
 * Checks that args is [string, string, array]
 */
function isSystemContractCallFormat(
  args?: unknown[]
): args is [string, string, unknown[]] {
  return !!(
    args &&
    args.length === 3 &&
    Array.isArray(args[2]) &&
    typeof args[1] === "string" &&
    typeof args[0] === "string"
  );
}

/**
 * Read a script to readable contract invocations.
 * @extends StringStream
 */
export class ScriptParser extends StringStream {
  /**
   * Retrieves a single AppCall.
   * Returns ScriptIntents starting from the beginning of the script.
   * This is based off the pointer in the stream.
   * @returns A single ScriptIntent if available.
   */
  private retrieveAppCall(): ScriptIntent | null {
    const output = {
      scriptHash: "",
      operation: "",
      args: [] as unknown[]
    };

    while (!this.isEmpty()) {
      const b = this.read();
      const n = parseInt(b, 16);
      switch (true) {
        /* PUSH0 or PUSHF */
        case n === 0:
          output.args.unshift(0);
          break;
        /* PUSHBYTES1 or PUSHBYTES75 */
        case n <= 75:
          output.args.unshift(this.read(n));
          break;
        /* PUSHDATA1 */
        case n === 76:
          output.args.unshift(this.read(parseInt(this.read(1), 16)));
          break;
        /* PUSHDATA2 */
        case n === 77:
          output.args.unshift(this.read(parseInt(this.read(2), 16)));
          break;
        /* PUSHDATA4 */
        case n === 78:
          output.args.unshift(this.read(parseInt(this.read(4), 16)));
          break;
        /* PUSHM1 */
        case n === 79:
          output.args.unshift(-1);
          break;
        /* PUSH1 ~ PUSH16 */
        case n >= 81 && n <= 96:
          output.args.unshift(n - 80);
          break;
        /* PACK */
        case n === 193:
          const len = output.args.shift() as number;
          const cache = [];
          for (let i = 0; i < len; i++) {
            cache.push(output.args.shift());
          }
          output.args.unshift(cache);
          break;
        /* RET */
        case n === 102:
          this.pter = this.str.length;
          break;
        /* SYSCALL */
        case n === 104:
          const interopServiceCode = this.read(4) as InteropServiceCode;
          if (interopServiceCode !== InteropServiceCode.SYSTEM_CONTRACT_CALL) {
            throw new Error(
              `Encounter unknown interop service: ${interopServiceCode}`
            );
          }
          if (!isSystemContractCallFormat(output.args)) {
            throw new Error(
              `ScriptIntent not in the right format: ${output.args}`
            );
          }
          output.scriptHash = reverseHex(output.args.shift() as string);
          output.operation = hexstring2str(output.args.shift() as string);
          output.args = output.args.shift() as unknown[];
          return output;
        /* THROWIFNOT, neo-cli will add this op to end of script */
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
   * Reverse engineer a script back to its params.
   * A script may have multiple invocations so a list is always returned.
   * @return A list of ScriptIntents[].
   */
  public toScriptParams(): ScriptIntent[] {
    this.reset();
    const scripts = [];
    while (!this.isEmpty()) {
      const a = this.retrieveAppCall();
      if (a) {
        scripts.push(a);
      }
    }
    return scripts;
  }
}

export default ScriptParser;
