"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secure_random_1 = __importDefault(require("secure-random"));
/**
 * Generates a arrayBuffer filled with random bits.
 * @param {number} length - Length of buffer.
 */
exports.generateRandomArray = (length) => {
    return secure_random_1.default(length);
};
//# sourceMappingURL=random.js.map