import { BigInteger } from "../u";
import InteropServiceCode from "./InteropServiceCode";
import { getInteropServicePrice } from "./InteropServicePrices";
import OpCode from "./OpCode";
import { OpCodePrices } from "./OpCodePrices";
import { OpToken } from "./OpToken";

/**
 * Estimate the cost of running an arbitrary script in the VM.
 * This only supports running non APPCALL scripts.
 * Mainly used to calculate network fees.
 */
export function calculateExecutionFee(script: string | OpToken[]): BigInteger {
  const opTokens =
    typeof script === "string" ? OpToken.fromScript(script) : script;

  return opTokens
    .map((token, i) => {
      if (
        token.code === OpCode.SYSCALL &&
        token.params &&
        token.params.length === 8
      ) {
        const interopCode = token.params as InteropServiceCode;
        if (
          interopCode ===
            InteropServiceCode.NEO_CRYPTO_CHECKMULTISIGWITHECDSASECP256R1 ||
          interopCode ===
            InteropServiceCode.NEO_CRYPTO_CHECKMULTISIGWITHECDSASECP256K1
        ) {
          const threshold = extractThresholdForMultiSig(opTokens, i);
          return BigInteger.fromDecimal(OpCodePrices[token.code], 8).add(
            BigInteger.fromDecimal(
              getInteropServicePrice(
                InteropServiceCode.NEO_CRYPTO_VERIFYWITHECDSASECP256R1
              ),
              8
            ).mul(threshold)
          );
        }
        return BigInteger.fromDecimal(OpCodePrices[token.code], 8).add(
          BigInteger.fromDecimal(getInteropServicePrice(interopCode), 8)
        );
      } else {
        return BigInteger.fromDecimal(OpCodePrices[token.code], 8);
      }
    })
    .reduce((a, b) => a.add(b), BigInteger.fromNumber(0));
}

function extractThresholdForMultiSig(
  tokens: OpToken[],
  sysCallIndex: number
): number {
  // We know that for a multisig of threshold t & no.of keys k the order is:
  // t, key1, key2, ...keyk, k, OpToken.PUSHNULL, SYSCALL
  const tokenK = tokens[sysCallIndex - 2];
  const k = OpToken.parseInt(tokenK);
  const tokenT = tokens[sysCallIndex - 2 - k - 1];
  return OpToken.parseInt(tokenT);
}
