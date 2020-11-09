import { rpc, sc } from "@cityofzion/neon-core";
import { BigInteger } from "@cityofzion/neon-core/lib/u";

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
      `Invoke exception: ${
        response.exception ?? "No exception returned from invoke."
      }`
    );
  }
  return response.stack.reduce((balances, stackValue, index) => {
    if (index % 2 === 0) {
      balances.push(stackValue.value as string);
      return balances;
    }
    const decimals = parseInt(balances.pop() as string);
    balances.push(
      BigInteger.fromNumber(stackValue.value as string).toDecimal(decimals)
    );
    return balances;
  }, [] as string[]);
}
