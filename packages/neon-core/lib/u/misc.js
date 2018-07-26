"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const convert_1 = require("./convert");
/**
 * XORs two hexstrings
 * @param str1 HEX string
 * @param str2 HEX string
 * @returns XOR output as a HEX string
 */
function hexXor(str1, str2) {
    ensureHex(str1);
    ensureHex(str2);
    if (str1.length !== str2.length) {
        throw new Error("strings are disparate lengths");
    }
    const result = [];
    for (let i = 0; i < str1.length; i += 2) {
        result.push(
        // tslint:disable-next-line:no-bitwise
        parseInt(str1.substr(i, 2), 16) ^ parseInt(str2.substr(i, 2), 16));
    }
    return convert_1.ab2hexstring(result);
}
exports.hexXor = hexXor;
/**
 * Reverses an array.
 */
function reverseArray(arr) {
    if (typeof arr !== "object" || !arr.length) {
        throw new Error("reverseArray expects an array");
    }
    const result = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        result[i] = arr[arr.length - 1 - i];
    }
    return result;
}
exports.reverseArray = reverseArray;
/**
 * Reverses a HEX string, treating 2 chars as a byte.
 * @example
 * reverseHex('abcdef') = 'efcdab'
 */
function reverseHex(hex) {
    ensureHex(hex);
    let out = "";
    for (let i = hex.length - 2; i >= 0; i -= 2) {
        out += hex.substr(i, 2);
    }
    return out;
}
exports.reverseHex = reverseHex;
const hexRegex = /^([0-9A-Fa-f]{2})*$/;
/**
 * Checks if input is a hexstring. Empty string is considered a hexstring.
 */
function isHex(str) {
    try {
        return hexRegex.test(str);
    }
    catch (err) {
        return false;
    }
}
exports.isHex = isHex;
/**
 * Throws an error if input is not hexstring.
 */
function ensureHex(str) {
    if (!isHex(str)) {
        throw new Error(`Expected a hexstring but got ${str}`);
    }
}
exports.ensureHex = ensureHex;
//# sourceMappingURL=misc.js.map