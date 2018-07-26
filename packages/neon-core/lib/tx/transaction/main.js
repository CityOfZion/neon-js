"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const u_1 = require("../../u");
const components_1 = require("../components");
function deserializeType(ss, tx = {}) {
    const byte = ss.read();
    return Object.assign(tx, { type: parseInt(byte, 16) });
}
exports.deserializeType = deserializeType;
function deserializeVersion(ss, tx = {}) {
    const byte = ss.read();
    return Object.assign({ version: parseInt(byte, 16) });
}
exports.deserializeVersion = deserializeVersion;
function deserializeAttributes(ss, tx) {
    const attributes = deserializeArrayOf(components_1.TransactionAttribute.fromStream, ss).map(i => i.export());
    return Object.assign(tx, { attributes });
}
exports.deserializeAttributes = deserializeAttributes;
function deserializeInputs(ss, tx) {
    const inputs = deserializeArrayOf(components_1.TransactionInput.fromStream, ss).map(i => i.export());
    return Object.assign(tx, { inputs });
}
exports.deserializeInputs = deserializeInputs;
function deserializeOutputs(ss, tx) {
    const outputs = deserializeArrayOf(components_1.TransactionOutput.fromStream, ss).map(i => i.export());
    return Object.assign(tx, { outputs });
}
exports.deserializeOutputs = deserializeOutputs;
function deserializeWitnesses(ss, tx) {
    const scripts = deserializeArrayOf(components_1.Witness.fromStream, ss).map(i => i.export());
    return Object.assign(tx, { scripts });
}
exports.deserializeWitnesses = deserializeWitnesses;
function deserializeArrayOf(type, ss) {
    const output = [];
    const len = ss.readVarInt();
    for (let i = 0; i < len; i++) {
        output.push(type(ss));
    }
    return output;
}
exports.deserializeArrayOf = deserializeArrayOf;
function serializeArrayOf(prop) {
    return u_1.num2VarInt(prop.length) + prop.map(p => p.serialize()).join("");
}
exports.serializeArrayOf = serializeArrayOf;
//# sourceMappingURL=main.js.map