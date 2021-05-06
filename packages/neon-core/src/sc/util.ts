import { hash160, HexString, reverseHex } from "../u";
import { OpCode } from "./OpCode";
import { Buffer } from "buffer";
import { ScriptBuilder } from "./ScriptBuilder";
import { ContractParam } from "./ContractParam";
import { InteropServiceCode } from "./InteropServiceCode";

/**
 * Check if the format of input matches that of a single signature contract
 */
export function isSignatureContract(input: HexString): boolean {
  const PUBLIC_KEY_LENGTH = 33;
  const script = Buffer.from(input.toString(), "hex");
  return !(
    script.length != 40 ||
    script[0] != OpCode.PUSHDATA1 ||
    script[1] != PUBLIC_KEY_LENGTH ||
    script[35] != OpCode.SYSCALL ||
    script.slice(36, 40).toString("hex") !=
      InteropServiceCode.SYSTEM_CRYPTO_CHECKSIG
  );
}

/**
 * Check if the format of input matches that of a multi-signature contract
 */
export function isMultisigContract(input: HexString): boolean {
  const script = Buffer.from(input.toString(), "hex");
  if (script.length < 42) {
    return false;
  }

  let signatureCount, i;
  if (script[0] == OpCode.PUSHINT8) {
    signatureCount = script[1];
    i = 2;
  } else if (script[0] == OpCode.PUSHINT16) {
    signatureCount = script.readUInt16LE(1);
    i = 3;
  } else if (script[0] <= OpCode.PUSH1 || script[0] >= OpCode.PUSH16) {
    signatureCount = script[0] - OpCode.PUSH0;
    i = 1;
  } else {
    return false;
  }

  if (signatureCount < 1 || signatureCount > 1024) {
    return false;
  }

  let publicKeyCount = 0;
  while (script[i] == OpCode.PUSHDATA1) {
    if (script.length <= i + 35) {
      return false;
    }
    if (script[i + 1] != 33) {
      return false;
    }
    i += 35;
    publicKeyCount += 1;
  }

  if (publicKeyCount < signatureCount || publicKeyCount > 1024) {
    return false;
  }

  const value = script[i];
  if (value == OpCode.PUSHINT8) {
    if (script.length <= i + 1 || publicKeyCount != script[i + 1]) {
      return false;
    }
    i += 2;
  } else if (value == OpCode.PUSHINT16) {
    if (script.length < i + 3 || publicKeyCount != script.readUInt16LE(i + 1)) {
      return false;
    }
    i += 3;
  } else if (OpCode.PUSH1 <= value && value <= OpCode.PUSH16) {
    if (publicKeyCount != value - OpCode.PUSH0) {
      return false;
    }
    i += 1;
  } else {
    return false;
  }

  if (script.length != i + 5 || script[i + 1] != OpCode.SYSCALL) {
    return false;
  }

  i += 2;
  if (
    script.slice(i, i + 4).toString("hex") !=
    InteropServiceCode.SYSTEM_CRYPTO_CHECKMULTISIG
  ) {
    return false;
  }

  return true;
}

export function getNativeContractHash(contractName: string): string {
  const innerScript = new ScriptBuilder()
    .emitString(contractName)
    .emitSysCall(InteropServiceCode.SYSTEM_CONTRACT_CALLNATIVE)
    .build();

  const script = new ScriptBuilder()
    .emit(OpCode.ABORT)
    .emitContractParam(ContractParam.hash160("0".repeat(40)))
    .emitHexString(innerScript)
    .build();
  return reverseHex(hash160(script));
}
