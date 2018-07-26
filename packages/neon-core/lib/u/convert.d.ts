/**
 * @param buf ArrayBuffer
 * @returns ASCII string
 */
export declare function ab2str(buf: ArrayBuffer | ArrayLike<number>): string;
/**
 * @param str ASCII string
 * @returns
 */
export declare function str2ab(str: string): Uint8Array;
/**
 * @param str HEX string
 * @returns
 */
export declare function hexstring2ab(str: any): Uint8Array;
/**
 * @param arr
 * @returns HEX string
 */
export declare function ab2hexstring(arr: ArrayBuffer | ArrayLike<number>): string;
/**
 * @param str - ASCII string
 * @returns HEX string
 */
export declare function str2hexstring(str: string): string;
/**
 * @param hexstring HEX string
 * @returns ASCII string
 */
export declare function hexstring2str(hexstring: string): string;
/**
 * convert an integer to big endian hex and add leading zeros
 * @param num Integer.
 */
export declare function int2hex(num: number): string;
/**
 * Converts a number to a big endian hexstring of a suitable size, optionally little endian
 * @param num
 * @param size - The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
 * @param littleEndian - Encode the hex in little endian form
 */
export declare function num2hexstring(num: any, size?: number, littleEndian?: boolean): string;
/**
 * Converts a number to a Fixed8 format hex string
 * @param  num
 * @param size output size in bytes
 * @return number in Fixed8 representation.
 */
export declare function num2fixed8(num: number, size?: number): string;
/**
 * Converts a Fixed8 hex string to its original number
 * @param fixed8hex number in Fixed8 representation
 */
export declare function fixed82num(fixed8hex: string): number;
/**
 * Converts a number to a variable length Int. Used for array length header
 * @param num
 * @returns hexstring of int.
 */
export declare function num2VarInt(num: number): string;
//# sourceMappingURL=convert.d.ts.map