const hexRegex = /^([0-9A-Fa-f]{2})*$/;

/**
 * Checks if input is a hexstring. Empty string is considered a hexstring.
 */
export function isHex(str: string): boolean {
  try {
    return hexRegex.test(str);
  } catch {
    return false;
  }
}

/**
 * Remove the 0x prefix.
 */
export function remove0xPrefix(str: string): string {
  if (str.startsWith("0x")) {
    str = str.substring(2);
  }

  return str;
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
