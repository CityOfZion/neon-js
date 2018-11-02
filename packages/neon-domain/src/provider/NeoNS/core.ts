import { logging, u, sc, wallet } from "@cityofzion/neon-core";
import {
   resolve,
} from "../common";

const log = logging.default("neon-domain");

const operation = "resolve";

/**
 * Get balances of NEO and GAS for an address
 * @param url - URL of a neonDB service.
 * @param address - Address to check.
 * @return  Balance of address
 */
export async function resolveDomain(
  url: string,
  contract: string,
  domain: string,
  tld: string
): Promise<string> {

  const protocol = {
    type: "String",
    value: "addr"
  };

  const empty = {
    type: "String",
    value: ""
  };

  const tldRegEx = ".".concat(tld).concat("$"); 
  const regExp = new RegExp(tldRegEx);

  const subdomain = domain.replace(regExp, "");
  const hashSubdomain = u.sha256(u.str2hexstring(subdomain));
  const hashDomain = u.sha256(u.str2hexstring(tld));

  const hashName = u.sha256(hashSubdomain.concat(hashDomain));
  const parsedName = sc.ContractParam.byteArray(hashName, "name");

  const args = [protocol, parsedName, empty];

  const response = await resolve(url, domain, contract, operation, args);

  return response;
}

