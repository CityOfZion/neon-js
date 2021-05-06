import { ScriptBuilder, InteropServiceCode, OpCode, OpToken } from "../sc";
import { isPublicKey } from "./verify";

/**
 * Constructs the script for a multi-sig account.
 * @param signingThreshold - number of keys required for signing. Must be smaller or equal to the number of keys provided.
 * @param keys - public keys of all keys involved. Ordering matters.
 */
export function constructMultiSigVerificationScript(
  signingThreshold: number,
  keys: string[]
): string {
  if (signingThreshold <= 0) {
    throw new Error("signingThreshold must be bigger than zero.");
  }
  if (signingThreshold > keys.length) {
    throw new Error(
      "signingThreshold must be smaller than or equal to number of keys"
    );
  }

  const sb = new ScriptBuilder();
  sb.emitPush(signingThreshold);
  keys.forEach((k) => {
    if (!isPublicKey(k, true)) {
      throw new Error(`${k} is not a valid encoded public key`);
    }
    sb.emitPublicKey(k);
  });
  return sb
    .emitPush(keys.length)
    .emitSysCall(InteropServiceCode.SYSTEM_CRYPTO_CHECKMULTISIG)
    .build();
}

/**
 * Returns the list of public keys found in the verification script.
 * @param verificationScript - verification Script of an Account.
 */
export function getPublicKeysFromVerificationScript(
  verificationScript: string
): string[] {
  const operations = OpToken.fromScript(verificationScript);
  return operations.filter(looksLikePublicKey).map((t) => t.params);
}

function looksLikePublicKey(token: OpToken): token is Required<OpToken> {
  return (
    token.code === OpCode.PUSHDATA1 &&
    !!token.params &&
    token.params.length === 66
  );
}

/**
 * Returns the number of signatures required for signing for a verification Script.
 * @param verificationScript - verification script of a multi-sig Account.
 */
export function getSigningThresholdFromVerificationScript(
  verificationScript: string
): number {
  const operations = OpToken.fromScript(verificationScript);
  return OpToken.parseInt(operations[0]);
}

/**
 * Extract signatures from invocationScript
 * @param invocationScript - invocationScript of a Witness.
 */
export function getSignaturesFromInvocationScript(
  invocationScript: string
): string[] {
  return OpToken.fromScript(invocationScript)
    .filter(
      (token): token is Required<OpToken> =>
        token.code === OpCode.PUSHDATA1 &&
        !!token.params &&
        token.params.length === 128
    )
    .map((token) => token.params);
}
