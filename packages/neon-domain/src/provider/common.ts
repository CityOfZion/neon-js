import { logging, sc, rpc, u } from "@cityofzion/neon-core";

export interface DomainProvider {
  name: string;
  resolveDomain(url: string, domain: string, tld: string): Promise<string>;
}
const log = logging.default("neon-domain");

export async function resolve(
    url: string,
    domain: string,
    scriptHash: string, // = "348387116c4a75e420663277d9c02049907128c7", // default for now nns jump contract
    operation: string, // = "resolve"
    args: any[]
) {

  const sb = new sc.ScriptBuilder();
  const script = sb.emitAppCall(scriptHash, operation, args).str;
  try {
    const res = await rpc.Query.invokeScript(script).execute(url);
    return rpc.StringParser(res.result.stack[0]);
  } catch (err) {
    log.error(`resolveDomain failed with : ${err.message}`);
    throw err;
  }
}

