import { logging, rpc, sc } from "@cityofzion/neon-core";
import * as abi from "./abi";
const log = logging.default("nns");

export async function resolveNnsDomain(
  url: string,
  name: string
): Promise<string> {
  const sb = new sc.ScriptBuilder();
  abi.resolve(name)(sb);
  const script = sb.str;
  try {
    const res = await rpc.Query.invokeScript(script).execute(url);
    return rpc.StringParser(res.result.stack[0].value);
  } catch (err) {
    log.error(`resolveNnsDomain failed with : ${err.message}`);
    throw err;
  }
}
