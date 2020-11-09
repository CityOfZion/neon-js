import { rpc, sc, u } from "@cityofzion/neon-core";

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}
export async function getTokenInfo(
  scriptHash: string | sc.Nep5Contract,
  client: rpc.NeoServerRpcClient
): Promise<TokenInfo> {
  const contract =
    scriptHash instanceof sc.Nep5Contract
      ? scriptHash
      : new sc.Nep5Contract(scriptHash);
  const script = [
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply(),
  ]
    .reduce(
      (scriptBuilder, contractCall) =>
        scriptBuilder.emitContractCall(contractCall),
      new sc.ScriptBuilder()
    )
    .build();

  const response = await client.invokeScript(script);
  if (response.state === "FAULT") {
    throw new Error(
      `Invoke exception: ${
        response.exception ?? "No exception returned from invoke."
      }`
    );
  }
  const result = response.stack;
  const decimals = parseInt(result[2].value as string);
  return {
    name: u.HexString.fromBase64(result[0].value as string).toAscii(),
    symbol: u.HexString.fromBase64(result[1].value as string).toAscii(),
    decimals,
    totalSupply: u.BigInteger.fromNumber(result[3].value as string).toDecimal(
      decimals
    ),
  };
}
