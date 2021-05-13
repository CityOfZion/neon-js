import { OpCode, ScriptBuilder } from "../sc";
import { reverseHex, StringStream } from "../u";
import { isPublicKey } from "./verify";

export function constructMultiSigVerificationScript(
  signingThreshold: number,
  keys: string[]
): string {
  if (signingThreshold > keys.length) {
    throw new Error(
      "signingThreshold must be smaller than or equal to number of keys"
    );
  }

  const ss = new ScriptBuilder();
  ss.emitPush(signingThreshold);
  keys.forEach((k) => {
    if (!isPublicKey(k, true)) {
      throw new Error(`${k} is not a valid encoded public key`);
    }
    ss.emitPush(k);
  });
  ss.emitPush(keys.length);
  ss.emit(OpCode.CHECKMULTISIG);
  return ss.str;
}

/**
 * Returns the list of public keys found in the verification script.
 * @param verificationScript Verification Script of an Account.
 */
export function getPublicKeysFromVerificationScript(
  verificationScript: string
): string[] {
  const ss = new StringStream(verificationScript);
  const keys = [] as string[];
  while (!ss.isEmpty()) {
    const byte = ss.read();
    if (byte === "21") {
      keys.push(ss.read(33));
    }
  }
  return keys;
}

/**
 * Returns the number of signatures required for signing for a verification Script.
 * @param verificationScript Verification Script of a multi-sig Account.
 */
export function getSigningThresholdFromVerificationScript(
  verificationScript: string
): number {
  const checkSigOpCode = verificationScript.slice(
    verificationScript.length - 2
  );
  if (checkSigOpCode === "ac") {
    return 1;
  } else if (checkSigOpCode === "ae") {
    const ss = new StringStream(verificationScript);
    const byte = parseInt(ss.peek(), 16);
    if (byte < 80) {
      const hexNum = reverseHex(ss.readVarBytes());
      return parseInt(hexNum, 16);
    } else {
      return parseInt(ss.read(), 16) - 80;
    }
  } else {
    throw new Error(
      "VerificationScript does not call CHECKSIG or CHECKMULTISIG."
    );
  }
}

/**
 * Extract signatures from invocationScript
 * @param invocationScript InvocationScript of a Witness.
 */
export function getSignaturesFromInvocationScript(
  invocationScript: string
): string[] {
  const ss = new StringStream(invocationScript);
  const sigs = [];
  while (!ss.isEmpty()) {
    const byte = parseInt(ss.peek(), 16);
    if (byte > 80) {
      continue;
    } else if (byte === 4 * 16) {
      sigs.push(ss.readVarBytes());
    }
  }
  return sigs;
}
