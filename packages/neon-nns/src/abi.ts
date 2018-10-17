import { sc, u } from "@cityofzion/neon-core";

export function resolve(name: string) {
  return (sb = new sc.ScriptBuilder()) => {
    const protocol = {
      type: "String",
      value: "addr"
    };

    const empty = {
      type: "String",
      value: ""
    };

    const subdomain = name.replace(/.neo$/, "");
    const hashSubdomain = u.sha256(u.str2hexstring(subdomain));
    const hashDomain = u.sha256(u.str2hexstring("neo"));

    const hashName = u.sha256(hashSubdomain.concat(hashDomain));
    const parsedName = sc.ContractParam.byteArray(hashName, "name");

    const scriptHash = "348387116c4a75e420663277d9c02049907128c7";
    const operation = "resolve";
    const args = [protocol, parsedName, empty];

    return sb.emitAppCall(scriptHash, operation, args);
  };
}
