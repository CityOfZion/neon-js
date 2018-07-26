/**
 * XORs two hexstrings
 * @param str1 HEX string
 * @param str2 HEX string
 * @returns XOR output as a HEX string
 */
export declare function hexXor(str1: string, str2: string): string;
/**
 * Reverses an array.
 */
export declare function reverseArray<T>(arr: ArrayLike<T>): T[];
/**
 * Reverses a HEX string, treating 2 chars as a byte.
 * @example
 * reverseHex('abcdef') = 'efcdab'
 */
export declare function reverseHex(hex: string): string;
/**
 * Checks if input is a hexstring. Empty string is considered a hexstring.
 */
export declare function isHex(str: string): boolean;
/**
 * Throws an error if input is not hexstring.
 */
export declare function ensureHex(str: string): void;
//# sourceMappingURL=misc.d.ts.map