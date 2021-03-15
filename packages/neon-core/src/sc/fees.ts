import { BigInteger } from "../u";
import { InteropServiceCode } from "./InteropServiceCode";
import { getInteropServicePrice } from "./InteropServicePrices";
import { OpCode } from "./OpCode";
import { OpCodePrices } from "./OpCodePrices";
import { OpToken } from "./OpToken";

/**
 * Estimate the cost of running an arbitrary script in the VM.
 * This only supports running non APPCALL scripts.
 * Mainly used to calculate network fees.
 */
export function calculateExecutionFee(
  script: string | OpToken[],
  executionFeeFactor: number | BigInteger
): BigInteger {
  const opTokens =
    typeof script === "string" ? OpToken.fromScript(script) : script;

  const factor =
    typeof executionFeeFactor === "number"
      ? BigInteger.fromNumber(executionFeeFactor)
      : executionFeeFactor;

  return opTokens
    .map((token, i) => {
      if (
        token.code === OpCode.SYSCALL &&
        token.params &&
        token.params.length === 8
      ) {
        const interopCode = token.params as InteropServiceCode;
        if (interopCode === InteropServiceCode.NEO_CRYPTO_CHECKMULTISIG) {
          const threshold = extractThresholdForMultiSig(opTokens, i);
          return BigInteger.fromNumber(OpCodePrices[token.code]).add(
            BigInteger.fromNumber(
              getInteropServicePrice(InteropServiceCode.NEO_CRYPTO_CHECKSIG)
            )
              .mul(threshold)
              .mul(factor)
          );
        }

        return BigInteger.fromNumber(OpCodePrices[token.code])
          .add(BigInteger.fromNumber(getInteropServicePrice(interopCode)))
          .mul(factor);
      } else if (OpCode[token.code] !== null) {
        return BigInteger.fromNumber(OpCodePrices[token.code]).mul(factor);
      }
      throw new Error(`OpCode ${token.code} not found!`);
    })
    .reduce((a, b) => a.add(b), BigInteger.fromNumber(0));
}

function extractThresholdForMultiSig(
  tokens: OpToken[],
  sysCallIndex: number
): number {
  // We know that for a multisig of threshold t & no.of keys k the order is:
  // t, key1, key2, ...keyk, k, SYSCALL
  const tokenK = tokens[sysCallIndex - 1];
  const k = OpToken.parseInt(tokenK);
  const tokenT = tokens[sysCallIndex - 1 - k - 1];
  return OpToken.parseInt(tokenT);
}
