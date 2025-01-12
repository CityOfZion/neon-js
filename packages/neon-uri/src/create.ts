/**
 * Creates a uri with voting intent.
 * @param publicKey - The candidate to vote for.
 */
export function createVoteUri(publicKey: string): string {
  return `neo:vote-${publicKey}`;
}

/**
 * Creates a uri to request token transfer.
 * @param toAddress - Receipent address of the tokens.
 * @param asset - 'neo', 'gas' or a contract scripthash.
 * @param amount - Amount of tokens to transfer in integer amounts.
 *
 * @example
 *
 * To request 1.23456789 GAS to `NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk`:
 *
 * ```ts
 * import {createPayUri} from "@cityofzion/neon-uri";
 * const uri = createPayUri("NNWAo5vdVJz1oyCuNiaTBA3amBHnWCF4Yk", "gas", 123456789);
 * ```
 *
 */
export function createPayUri(
  toAddress: string,
  asset: string,
  amount?: number,
): string {
  let uri = `neo:${toAddress}?asset=${asset}`;
  if (amount) {
    uri += `&amount=${amount}`;
  }

  return uri;
}
