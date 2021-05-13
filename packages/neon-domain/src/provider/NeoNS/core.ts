import { rpc, sc, u } from "@cityofzion/neon-core";

const operation = "resolve";

/**
 * Resolve a domain to a public address.
 * @param url - URL of an NEO RPC service.
 * @param contract - the contract used to resolve
 * @param domain - the domain to resolve.
 * @return public address as string
 */

export async function resolveDomain(
  url: string,
  contract: string,
  domain: string
): Promise<string> {
  const protocol = {
    type: "String",
    value: "addr",
  };

  const empty = {
    type: "String",
    value: "",
  };

  const tld = domain.split(".").reverse()[0];
  const regExp = new RegExp(`.${tld}$`);

  const subdomain = domain.replace(regExp, "");
  const hashSubdomain = u.sha256(u.str2hexstring(subdomain));
  const hashDomain = u.sha256(u.str2hexstring(tld));

  const hashName = u.sha256(hashSubdomain.concat(hashDomain));
  const parsedName = sc.ContractParam.byteArray(hashName, "name");

  const args = [protocol, parsedName, empty];

  const sb = new sc.ScriptBuilder();
  const script = sb.emitAppCall(contract, operation, args).str;
  const res = await rpc.Query.invokeScript(script).execute(url);

  return rpc.StringParser(res.result.stack[0]);
}
