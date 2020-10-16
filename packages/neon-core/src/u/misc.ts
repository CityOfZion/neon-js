import { ab2hexstring } from "./convert";

const hexRegex = /^([0-9A-Fa-f]{2})*$/;

/**
 * Checks if input is a hexstring. Empty string is considered a hexstring.
 */
export function isHex(str: string): boolean {
  try {
    return hexRegex.test(str);
  } catch (err) {
    return false;
  }
}

/**
 * Throws an error if input is not hexstring.
 */
export function ensureHex(str: string): void {
  if (!isHex(str)) {
    throw new Error(`Expected a hexstring but got ${str}`);
  }
}

/**
 * XORs two hexstrings
 *
 * @param str1 - HEX string
 * @param str2 - HEX string
 * @returns XOR output as a HEX string
 */
export function hexXor(str1: string, str2: string): string {
  ensureHex(str1);
  ensureHex(str2);
  if (str1.length !== str2.length) {
    throw new Error(
      `strings are disparate lengths. Inputs are of length ${str1.length} and ${str2.length}`
    );
  }
  const result = [];
  for (let i = 0; i < str1.length; i += 2) {
    result.push(
      // tslint:disable-next-line:no-bitwise
      parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16)
    );
  }
  return ab2hexstring(result);
}

/**
 * Reverses an array.
 *
 * @example
 * reverseArray('abcd') = 'dcba'
 */
export function reverseArray<T>(arr: ArrayLike<T>): T[] {
  if (typeof arr !== "object" || !arr.length) {
    throw new Error("reverseArray expects an array");
  }
  const result = new Array<T>(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i];
  }
  return result;
}

/**
 * Reverses a HEX string, treating 2 chars as a byte.
 *
 * @example
 * reverseHex('abcdef') = 'efcdab'
 */
export function reverseHex(hex: string): string {
  ensureHex(hex);
  let out = "";
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    out += hex.substr(i, 2);
  }
  return out;
}

/* 
Helper to check if signatures are multi-sig
*/
interface SignParamsLike {
  publicKeyCount: number;
  signatureCount: number;
}

export function isMultisigContract(
    signatureScript: string,
    state?: SignParamsLike
    ): boolean {
  const script = Buffer.from(signatureScript, "hex");
  if (script.length < 43) {
    return false;
  }

  //Hard-coded sys calls
  const PUSHINT8 = 12, //0 //0x00
    PUSHINT16 = 1, //1 //0x01
    PUSH0 = 16, //16 //0x10
    PUSH1 = 17, //17 //0x11
    PUSH16 = 32, //32 //0x20
    PUSHDATA1 = 12, //12 //0x0C
    PUSHNULL = 11, //11 //0x0B
    SYSCALL = 65; //65 //0x41
  let signatureCount, i;
  if (script[0] == PUSHINT8) {
    signatureCount = script[1];
    i = 2;
  } else if (script[0] == PUSHINT16) {
    signatureCount = script.readUInt16LE(1);
    i = 3;
  } else if (script[0] <= PUSH1 || script[0] >= PUSH16) {
    signatureCount = script[0] - PUSH0;
    i = 1;
  } else{
      return false;
  }

  if (signatureCount < 1 || signatureCount > 1024) {
    return false;
  }

  let publicKeyCount = 0;
  while(script[i] == PUSHDATA1) {
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
  if (value == PUSHINT8) {
    if (script.length <= i + 1 || publicKeyCount != script[i + 1]) {
      return false;
    }
    i += 2;
  } else if (value == PUSHINT16) {
    if (script.length < i + 3 || publicKeyCount != script.readUInt16LE(i + 1)) {
      return false;
    }
    i += 3;
  } else if (PUSH1 <= value && value <= PUSH16) {
    if (publicKeyCount != (value - PUSH0)) {
      return false;
    }
    i += 1;
  } else{
    return false;
  }

  if ( (script.length != (i + 6)) || (script[i] != PUSHNULL) || (script[i + 1] != SYSCALL) ){
    return false;
  }

  i += 2;

  /*
  AFEF8D13 || 2951712019
  */
  if (script.readUInt32LE(i) != 2951712019) {
    return false;
  }
   
  if (state) {
    state.publicKeyCount = publicKeyCount;
    state.signatureCount = signatureCount;
  }

  return true;
}
