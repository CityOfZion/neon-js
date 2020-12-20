import { sc, rpc, u } from "@cityofzion/neon-core";

/**
 * Helper method for retrieving fee-related information from PolicyContract.
 */
export async function getFeeInformation(
  client: rpc.NeoServerRpcClient
): Promise<{ feePerByte: u.BigInteger; executionFeeFactor: u.BigInteger }> {
  const policyScript = new sc.ScriptBuilder()
    .emitContractCall(sc.PolicyContract.INSTANCE.getFeePerByte())
    .emitContractCall(sc.PolicyContract.INSTANCE.getExecFeeFactor())
    .build();

  const res = await client.invokeScript(u.HexString.fromHex(policyScript));
  const [feePerByte, executionFeeFactor] = res.stack.map((s) =>
    u.BigInteger.fromNumber(s.value as string)
  );

  return { feePerByte, executionFeeFactor };
}
