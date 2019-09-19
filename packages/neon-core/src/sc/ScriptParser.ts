import { reverseHex, StringStream, hexstring2str } from "../u";
import { ScriptIntent } from "./ScriptBuilder";
import InteropServiceCode from "./InteropServiceCode";

function checkArgs(args?: any[]): void {
  if (
    !args ||
    args.length !== 3 ||
    !Array.isArray(args[2]) ||
    typeof args[1] !== "string" ||
    typeof args[0] !== "string"
  ) {
    throw new Error(`Script Intent Not In the right format: ${args}`);
  }
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
    const output: ScriptIntent = {
      scriptHash: "",
      operation: "",
      args: []
    };

    while (!this.isEmpty()) {
      const b = this.read();
      const n = parseInt(b, 16);
      switch (true) {
        /* PUSH0 or PUSHF */
        case n === 0:
          output.args!.unshift(0);
          break;
        /* PUSHBYTES1 or PUSHBYTES75 */
        case n <= 75:
          output.args!.unshift(this.read(n));
          break;
        /* PUSHDATA1 */
        case n === 76:
          output.args!.unshift(this.read(parseInt(this.read(1), 16)));
          break;
        /* PUSHDATA2 */
        case n === 77:
          output.args!.unshift(this.read(parseInt(this.read(2), 16)));
          break;
        /* PUSHDATA4 */
        case n === 78:
          output.args!.unshift(this.read(parseInt(this.read(4), 16)));
          break;
        /* PUSHM1 */
        case n === 79:
          output.args!.unshift(-1);
          break;
        /* PUSH1 ~ PUSH16 */
        case n >= 81 && n <= 96:
          output.args!.unshift(n - 80);
          break;
        /* PACK */
        case n === 193:
          const len = output.args!.shift();
          const cache = [];
          for (let i = 0; i < len; i++) {
            cache.push(output.args!.shift());
          }
          output.args!.unshift(cache);
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
              `Encounter unknown interop serivce: ${interopServiceCode}`
            );
          }
          checkArgs(output.args);
          output.scriptHash = reverseHex(output.args!.shift());
          output.operation = hexstring2str(output.args!.shift());
          output.args = output.args!.shift();
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
