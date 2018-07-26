"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function compareNeonObjectArray(arr1, arr2 = []) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (const c of arr1) {
        if (!arr2.find(cl => c.equals(c))) {
            return false;
        }
    }
    return true;
}
exports.compareNeonObjectArray = compareNeonObjectArray;
function compareObject(current, other) {
    const keys = Object.keys(current);
    const otherKeys = Object.keys(other);
    if (keys.length !== otherKeys.length) {
        return false;
    }
    for (const key of keys) {
        if (other[key] !== undefined && current[key] === other[key]) {
            continue;
        }
        return false;
    }
    return true;
}
exports.compareObject = compareObject;
function compareUnsortedPlainArrays(current, other) {
    if (!Array.isArray(current) || !Array.isArray(other) || current.length !== other.length) {
        return false;
    }
    for (let i = 0; i < current.length; i++) {
        if (current[i] !== other[i]) {
            return false;
        }
    }
    return true;
}
exports.compareUnsortedPlainArrays = compareUnsortedPlainArrays;
function compareArray(current, other) {
    if (current.length !== other.length) {
        return false;
    }
    for (let i = 0; i < current.length; i++) {
        if (typeof (current[i]) === "object" && typeof (other[i]) === "object") {
            const objectEquality = compareObject(current[i], other[i]);
            if (!objectEquality) {
                return false;
            }
        }
        if (current[i] !== other[i]) {
            return false;
        }
    }
    return true;
}
exports.compareArray = compareArray;
//# sourceMappingURL=helper.js.map