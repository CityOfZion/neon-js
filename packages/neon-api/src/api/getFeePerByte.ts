import { rpc, u, CONST } from "@cityofzion/neon-core";

/**
 * Helper method for retrieving FeePerByte information.
 * This is the rate 
 */
export async function getFeePerByte(
  client: rpc.NeoServerRpcClient
): Promise<u.BigInteger> {
  const response = await client.invokeFunction(
    CONST.NATIVE_CONTRACTS.POLICY,
    "getFeePerByte"
  );

  const stackResult = response.stack[0];
  return u.BigInteger.fromNumber(stackResult.value as string);
}
