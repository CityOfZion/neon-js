"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Fixed8_1 = __importDefault(require("./Fixed8"));
const misc_1 = require("./misc");
/**
 * @param buf ArrayBuffer
 * @returns ASCII string
 */
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}
exports.ab2str = ab2str;
/**
 * @param str ASCII string
 * @returns
 */
function str2ab(str) {
    if (typeof str !== "string") {
        throw new Error("str2ab expects a string");
    }
    const result = new Uint8Array(str.length);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        result[i] = str.charCodeAt(i);
    }
    return result;
}
exports.str2ab = str2ab;
/**
 * @param str HEX string
 * @returns
 */
function hexstring2ab(str) {
    misc_1.ensureHex(str);
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
exports.hexstring2ab = hexstring2ab;
/**
 * @param arr
 * @returns HEX string
 */
function ab2hexstring(arr) {
    if (typeof arr !== "object") {
        throw new Error("ab2hexstring expects an array");
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
exports.ab2hexstring = ab2hexstring;
/**
 * @param str - ASCII string
 * @returns HEX string
 */
function str2hexstring(str) {
    return ab2hexstring(str2ab(str));
}
exports.str2hexstring = str2hexstring;
/**
 * @param hexstring HEX string
 * @returns ASCII string
 */
function hexstring2str(hexstring) {
    return ab2str(hexstring2ab(hexstring));
}
exports.hexstring2str = hexstring2str;
/**
 * convert an integer to big endian hex and add leading zeros
 * @param num Integer.
 */
function int2hex(num) {
    if (typeof num !== "number") {
        throw new Error("int2hex expects a number");
    }
    const h = num.toString(16);
    return h.length % 2 ? "0" + h : h;
}
exports.int2hex = int2hex;
/**
 * Converts a number to a big endian hexstring of a suitable size, optionally little endian
 * @param num
 * @param size - The required size in bytes, eg 1 for Uint8, 2 for Uint16. Defaults to 1.
 * @param littleEndian - Encode the hex in little endian form
 */
function num2hexstring(num, size = 1, littleEndian = false) {
    if (typeof num !== "number") {
        throw new Error("num must be numeric");
    }
    if (num < 0) {
        throw new RangeError("num is unsigned (>= 0)");
    }
    if (size % 1 !== 0) {
        throw new Error("size must be a whole integer");
    }
    if (!Number.isSafeInteger(num)) {
        throw new RangeError(`num (${num}) must be a safe integer`);
    }
    size = size * 2;
    let hexstring = num.toString(16);
    hexstring =
        hexstring.length % size === 0
            ? hexstring
            : ("0".repeat(size) + hexstring).substring(hexstring.length);
    if (littleEndian) {
        hexstring = misc_1.reverseHex(hexstring);
    }
    return hexstring;
}
exports.num2hexstring = num2hexstring;
/**
 * Converts a number to a Fixed8 format hex string
 * @param  num
 * @param size output size in bytes
 * @return number in Fixed8 representation.
 */
function num2fixed8(num, size = 8) {
    if (typeof num !== "number") {
        throw new Error("num must be numeric");
    }
    if (size % 1 !== 0) {
        throw new Error("size must be a whole integer");
    }
    const i = new Fixed8_1.default(num);
    return new Fixed8_1.default(num).toReverseHex().slice(0, size * 2);
}
exports.num2fixed8 = num2fixed8;
/**
 * Converts a Fixed8 hex string to its original number
 * @param fixed8hex number in Fixed8 representation
 */
function fixed82num(fixed8hex) {
    misc_1.ensureHex(fixed8hex);
    if (fixed8hex === "") {
        return 0;
    }
    return Fixed8_1.default.fromReverseHex(fixed8hex).toNumber();
}
exports.fixed82num = fixed82num;
/**
 * Converts a number to a variable length Int. Used for array length header
 * @param num
 * @returns hexstring of int.
 */
function num2VarInt(num) {
    if (num < 0xfd) {
        return num2hexstring(num);
    }
    else if (num <= 0xffff) {
        // uint16
        return "fd" + num2hexstring(num, 2, true);
    }
    else if (num <= 0xffffffff) {
        // uint32
        return "fe" + num2hexstring(num, 4, true);
    }
    else {
        // uint64
        return "ff" + num2hexstring(num, 8, true);
    }
}
exports.num2VarInt = num2VarInt;
//# sourceMappingURL=convert.js.map