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
 * @param str1 HEX string
 * @param str2 HEX string
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
 * @example
 * reverseArray('abcd') = 'cdba'
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
