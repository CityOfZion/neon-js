import { rpc, sc, u } from "@cityofzion/neon-core";

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

const CHUNK_SIZE = 4;

export async function getTokenInfos(
  contracts: (string | sc.Nep5Contract)[],
  client: rpc.NeoServerRpcClient
): Promise<TokenInfo[]> {
  const script = contracts
    .map((scriptHash) =>
      scriptHash instanceof sc.Nep5Contract
        ? scriptHash
        : new sc.Nep5Contract(scriptHash)
    )
    .map((contract) => [
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply(),
    ])
    .reduce((sb, contractCalls) => {
      contractCalls.forEach((cc) => sb.emitContractCall(cc));
      return sb;
    }, new sc.ScriptBuilder())
    .build();

  const response = await client.invokeScript(script);
  if (response.state === "FAULT") {
    throw new Error(
      response.exception
        ? `Invoke exception: ${response.exception}}`
        : "No exception returned."
    );
  }

  const expectedStackLength = contracts.length * CHUNK_SIZE;
  if (response.stack.length !== expectedStackLength) {
    throw new Error(
      `Received unexpected results. Expected ${expectedStackLength} but got ${response.stack.length} instead.`
    );
  }

  const results = [];
  for (let i = 0; i < response.stack.length; i += CHUNK_SIZE) {
    results.push(response.stack.slice(i, i + CHUNK_SIZE));
  }

  return results.map((result) => {
    const decimals = parseInt(result[2].value as string);
    return {
      name: u.HexString.fromBase64(result[0].value as string).toAscii(),
      symbol: u.HexString.fromBase64(result[1].value as string).toAscii(),
      decimals,
      totalSupply: u.BigInteger.fromNumber(result[3].value as string).toDecimal(
        decimals
      ),
    };
  });
}
