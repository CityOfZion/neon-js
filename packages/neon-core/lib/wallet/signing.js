"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bn_js_1 = __importDefault(require("bn.js"));
const elliptic_1 = require("elliptic");
const u_1 = require("../u");
const core_1 = require("./core");
const verify_1 = require("./verify");
exports.curve = new elliptic_1.ec("p256");
function sign(hex, privateKey) {
    if (verify_1.isWIF(privateKey)) {
        privateKey = core_1.getPrivateKeyFromWIF(privateKey);
    }
    const msgHash = u_1.sha256(hex);
    const msgHashHex = Buffer.from(msgHash, "hex");
    const sig = exports.curve.sign(msgHashHex, privateKey);
    return sig.r.toString("hex", 32) + sig.s.toString("hex", 32);
}
exports.sign = sign;
function verify(hex, sig, publicKey) {
    if (!verify_1.isPublicKey(publicKey)) {
        throw new Error("Invalid public key");
    }
    if (!verify_1.isPublicKey(publicKey, true)) {
        publicKey = core_1.getPublicKeyUnencoded(publicKey);
    }
    const sigObj = getSignatureFromHex(sig);
    const messageHash = u_1.sha256(hex);
    return exports.curve.verify(messageHash, sigObj, publicKey, "hex");
}
exports.verify = verify;
/**
 * Converts signatureHex to a signature object with r & s.
 * @param {string} signatureHex
 */
const getSignatureFromHex = (signatureHex) => {
    const signatureBuffer = Buffer.from(signatureHex, "hex");
    const r = new bn_js_1.default(signatureBuffer.slice(0, 32).toString("hex"), 16, "be");
    const s = new bn_js_1.default(signatureBuffer.slice(32).toString("hex"), 16, "be");
    return { r, s };
};
//# sourceMappingURL=signing.js.map