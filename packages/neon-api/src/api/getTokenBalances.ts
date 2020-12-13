import { rpc, sc, u } from "@cityofzion/neon-core";

const CHUNK_SIZE = 2;

export async function getTokenBalances(
  address: string,
  contracts: (string | sc.Nep5Contract)[],
  client: rpc.NeoServerRpcClient
): Promise<string[]> {
  const script = contracts
    .map((scriptHash) =>
      scriptHash instanceof sc.Nep5Contract
        ? scriptHash
        : new sc.Nep5Contract(scriptHash)
    )
    .map((contract) => [contract.decimals(), contract.balanceOf(address)])
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
        : "No exception message returned."
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
    results.push(response.stack.slice(i, i + 3));
  }

  return results.map((result) => {
    const decimals = parseInt(result[0].value as string);
    return u.BigInteger.fromNumber(result[1].value as string).toDecimal(
      decimals
    );
  });
}
