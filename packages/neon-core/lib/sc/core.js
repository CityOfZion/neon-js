"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const u_1 = require("../u");
const ScriptBuilder_1 = __importDefault(require("./ScriptBuilder"));
function createScript(...intents) {
    const sb = new ScriptBuilder_1.default();
    for (const scriptIntent of intents) {
        if (typeof scriptIntent === "string") {
            sb.str += scriptIntent;
            continue;
        }
        if (!scriptIntent.scriptHash) {
            throw new Error("No scriptHash found!");
        }
        const { scriptHash, operation, args, useTailCall } = Object.assign({ operation: null, args: undefined, useTailCall: false }, scriptIntent);
        sb.emitAppCall(scriptHash, operation, args, useTailCall);
    }
    return sb.str;
}
exports.createScript = createScript;
/**
 * Generates script for deploying contract
 */
function generateDeployScript(params) {
    const sb = new ScriptBuilder_1.default();
    sb.emitPush(u_1.str2hexstring(params.description))
        .emitPush(u_1.str2hexstring(params.email))
        .emitPush(u_1.str2hexstring(params.author))
        .emitPush(u_1.str2hexstring(params.version))
        .emitPush(u_1.str2hexstring(params.name))
        .emitPush(params.needsStorage || false)
        .emitPush(params.returnType || "ff")
        .emitPush(params.parameterList)
        .emitPush(params.script)
        .emitSysCall("Neo.Contract.Create");
    return sb;
}
exports.generateDeployScript = generateDeployScript;
//# sourceMappingURL=core.js.map