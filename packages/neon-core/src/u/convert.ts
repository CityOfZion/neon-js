import { ensureHex, reverseHex } from "./basic";

/**
 * Converts an ArrayBuffer to an ASCII string.
 */
export function ab2str(buf: ArrayBuffer | ArrayLike<number>): string {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

/**
 * Converts an ASCII string into an arrayBuffer.
 */
export function str2ab(str: string): Uint8Array {
  if (typeof str !== "string") {
    throw new Error(`str2ab expected a string but got ${typeof str} instead.`);
  }
  const result = new Uint8Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    result[i] = str.charCodeAt(i);
  }
  return result;
}

/**
 * Converts a hexstring into an arrayBuffer.
 */
export function hexstring2ab(str: string): Uint8Array {
  ensureHex(str);
  if (!str.length) {
    return new Uint8Array(0);
  }
  const iters = str.length / 2;
  const result = new Uint8Array(iters);
  for (let i = 0; i < iters; i++) {
    result[i] = parseInt(str.substring(0, 2), 16);
    str = str.substring(2);
  }
  return result;
}

/**
 * Converts an arraybuffer to hexstring.
 */
export function ab2hexstring(arr: ArrayBuffer | ArrayLike<number>): string {
  if (typeof arr !== "object") {
    throw new Error(`ab2hexstring expects an array. Input was ${arr}`);
  }
  let result = "";
  const intArray = new Uint8Array(arr);
  for (const i of intArray) {
    let str = i.toString(16);
    str = str.length === 0 ? "00" : str.length === 1 ? "0" + str : str;
    result += str;
  }
  return result;
}

/**
 * Converts an ascii string to hexstring.
 */
export function str2hexstring(str: string): string {
  return ab2hexstring(str2ab(str));
}

/**
 * Converts a hexstring to ascii string.
 */
export function hexstring2str(hexstring: string): string {
  return ab2str(hexstring2ab(hexstring));
}

/**
 * convert an integer to big endian hex and add leading zeros.
 */
export function int2hex(num: number): string {
  if (typeof num !== "number") {
    throw new Error(`int2hex expected a number but got ${typeof num} instead.`);
  }
  const h = num.toString(16);
  return h.length % 2 ? "0" + h : h;
}

/**
 * Converts a number to a big endian hexstring of a suitable size, optionally little endian
 * @param num - a positive integer.
 * @param size - the required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
 * @param littleEndian - encode the hex in little endian form
 */
export function num2hexstring(
  num: number,
  size = 1,
  littleEndian = false
): string {
  if (typeof num !== "number") {
    throw new Error(
      `num2hexstring expected a number but got ${typeof num} instead.`
    );
  }
  if (num < 0) {
    throw new RangeError(
      `num2hexstring expected a positive integer but got ${num} instead.`
    );
  }
  if (size % 1 !== 0) {
    throw new Error(
      `num2hexstring expected a positive integer but got ${num} instead.`
    );
  }
  if (!Number.isSafeInteger(num)) {
    throw new RangeError(
      `num2hexstring expected a safe integer but got ${num} instead.`
    );
  }
  size = size * 2;
  let hexstring = num.toString(16);
  hexstring =
    hexstring.length % size === 0
      ? hexstring
      : ("0".repeat(size) + hexstring).substring(hexstring.length);
  if (littleEndian) {
    hexstring = reverseHex(hexstring);
  }
  return hexstring;
}

/**
 * Converts a number to a variable length Int. Used for array length header
 */
export function num2VarInt(num: number): string {
  if (num < 0xfd) {
    return num2hexstring(num);
  } else if (num <= 0xffff) {
    // uint16
    return "fd" + num2hexstring(num, 2, true);
  } else if (num <= 0xffffffff) {
    // uint32
    return "fe" + num2hexstring(num, 4, true);
  } else {
    // uint64
    return "ff" + num2hexstring(num, 8, true);
  }
}
