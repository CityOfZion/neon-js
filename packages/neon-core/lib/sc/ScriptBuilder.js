"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const u_1 = require("../u");
const ContractParam_1 = __importStar(require("./ContractParam"));
const OpCode_1 = __importDefault(require("./OpCode"));
/**
 * @class ScriptBuilder
 * @extends StringStream
 * @classdesc Builds a VM script in hexstring. Used for constructing smart contract method calls.
 */
class ScriptBuilder extends u_1.StringStream {
    /**
     * Appends an Opcode, followed by args
     */
    emit(op, args) {
        this.str += u_1.num2hexstring(op);
        if (args) {
            this.str += args;
        }
        return this;
    }
    /**
     * Appends args, operation and scriptHash
     * @param {string} scriptHash - Hexstring(BE)
     * @param {string|null} operation - ASCII, defaults to null
     * @param {Array|string|number|boolean} args - any
     * @param {boolean} useTailCall - Use TailCall instead of AppCall
     * @return {ScriptBuilder} this
     */
    emitAppCall(scriptHash, operation = null, args, useTailCall = false) {
        this.emitPush(args);
        if (operation) {
            let hexOp = "";
            for (let i = 0; i < operation.length; i++) {
                hexOp += u_1.num2hexstring(operation.charCodeAt(i));
            }
            this.emitPush(hexOp);
        }
        this._emitAppCall(scriptHash, useTailCall);
        return this;
    }
    /**
     * Appends a SysCall
     * @param {string} api - api of SysCall
     * @return {ScriptBuilder} this
     */
    emitSysCall(api) {
        if (!api) {
            throw new Error("Invalid SysCall API");
        }
        const apiBytes = u_1.str2hexstring(api);
        const length = u_1.int2hex(apiBytes.length / 2);
        if (length.length !== 2) {
            throw new Error("Invalid length for SysCall API");
        }
        const out = length + apiBytes;
        return this.emit(OpCode_1.default.SYSCALL, out);
    }
    /**
     * Appends data depending on type. Used to append params/array lengths.
     * @param {Array|string|number|boolean} data
     * @return {ScriptBuilder} this
     */
    emitPush(data) {
        switch (typeof data) {
            case "boolean":
                return this.emit(data ? OpCode_1.default.PUSHT : OpCode_1.default.PUSHF);
            case "string":
                return this._emitString(data);
            case "number":
                return this._emitNum(data);
            case "undefined":
                return this.emitPush(false);
            case "object":
                if (Array.isArray(data)) {
                    return this._emitArray(data);
                }
                else if (ContractParam_1.likeContractParam(data)) {
                    return this._emitParam(new ContractParam_1.default(data));
                }
                else if (data === null) {
                    return this.emitPush(false);
                }
                throw new Error(`Unidentified object: ${data}`);
            default:
                throw new Error();
        }
    }
    /**
     * Reverse engineer a script back to its params.
     * @return {scriptParams[]}
     */
    toScriptParams() {
        this.reset();
        const scripts = [];
        while (!this.isEmpty()) {
            const a = retrieveAppCall(this);
            if (a) {
                scripts.push(a);
            }
        }
        return scripts;
    }
    /**
     * Appends a AppCall and scriptHash. Used to end off a script.
     * @param scriptHash Hexstring(BE)
     * @param useTailCall Defaults to false
     */
    _emitAppCall(scriptHash, useTailCall = false) {
        u_1.ensureHex(scriptHash);
        if (scriptHash.length !== 40) {
            throw new Error("ScriptHash should be 20 bytes long!");
        }
        return this.emit(useTailCall ? OpCode_1.default.TAILCALL : OpCode_1.default.APPCALL, u_1.reverseHex(scriptHash));
    }
    /**
     * Private method to append an array
     * @private
     */
    _emitArray(arr) {
        for (let i = arr.length - 1; i >= 0; i--) {
            this.emitPush(arr[i]);
        }
        return this.emitPush(arr.length).emit(OpCode_1.default.PACK);
    }
    /**
     * Private method to append a hexstring.
     * @private
     * @param {string} hexstring - Hexstring(BE)
     * @return {ScriptBuilder} this
     */
    _emitString(hexstring) {
        u_1.ensureHex(hexstring);
        const size = hexstring.length / 2;
        if (size <= OpCode_1.default.PUSHBYTES75) {
            this.str += u_1.num2hexstring(size);
            this.str += hexstring;
        }
        else if (size < 0x100) {
            this.emit(OpCode_1.default.PUSHDATA1);
            this.str += u_1.num2hexstring(size);
            this.str += hexstring;
        }
        else if (size < 0x10000) {
            this.emit(OpCode_1.default.PUSHDATA2);
            this.str += u_1.num2hexstring(size, 2, true);
            this.str += hexstring;
        }
        else if (size < 0x100000000) {
            this.emit(OpCode_1.default.PUSHDATA4);
            this.str += u_1.num2hexstring(size, 4, true);
            this.str += hexstring;
        }
        else {
            throw new Error(`String too big to emit!`);
        }
        return this;
    }
    /**
     * Private method to append a number.
     * @private
     * @param {number} num
     * @return {ScriptBuilder} this
     */
    _emitNum(num) {
        if (num === -1) {
            return this.emit(OpCode_1.default.PUSHM1);
        }
        if (num === 0) {
            return this.emit(OpCode_1.default.PUSH0);
        }
        if (num > 0 && num <= 16) {
            return this.emit(OpCode_1.default.PUSH1 - 1 + num);
        }
        const hexstring = u_1.int2hex(num);
        return this.emitPush(u_1.reverseHex("0".repeat(16 - hexstring.length) + hexstring));
    }
    /**
     * Private method to append a ContractParam
     * @private
     */
    _emitParam(param) {
        if (!param.type) {
            throw new Error("No type available!");
        }
        if (!isValidValue(param.value)) {
            throw new Error("Invalid value provided!");
        }
        switch (param.type) {
            case ContractParam_1.ContractParamType.String:
                return this._emitString(u_1.str2hexstring(param.value));
            case ContractParam_1.ContractParamType.Boolean:
                return this.emit(param.value ? OpCode_1.default.PUSHT : OpCode_1.default.PUSHF);
            case ContractParam_1.ContractParamType.Integer:
                return this._emitNum(param.value);
            case ContractParam_1.ContractParamType.ByteArray:
                return this._emitString(param.value);
            case ContractParam_1.ContractParamType.Array:
                return this._emitArray(param.value);
            case ContractParam_1.ContractParamType.Hash160:
                return this._emitString(u_1.reverseHex(param.value));
            default:
                throw new Error(`Unaccounted ContractParamType!: ${param.type}`);
        }
    }
}
exports.ScriptBuilder = ScriptBuilder;
function isValidValue(value) {
    if (value) {
        return true;
    }
    else if (value === 0) {
        return true;
    }
    else if (value === "") {
        return true;
    }
    return false;
}
/**
 * Retrieves a single AppCall from a ScriptBuilder object.
 * @param sb
 */
function retrieveAppCall(sb) {
    const output = {
        scriptHash: "",
        args: []
    };
    while (!sb.isEmpty()) {
        const b = sb.read();
        const n = parseInt(b, 16);
        switch (true) {
            case n === 0:
                output.args.unshift(0);
                break;
            case n < 75:
                output.args.unshift(sb.read(n));
                break;
            case n >= 81 && n <= 96:
                output.args.unshift(n - 80);
                break;
            case n === 193:
                const len = output.args.shift();
                const cache = [];
                for (let i = 0; i < len; i++) {
                    cache.unshift(output.args.shift());
                }
                output.args.unshift(cache);
                break;
            case n === 102:
                sb.pter = sb.str.length;
                break;
            case n === 103:
                output.scriptHash = u_1.reverseHex(sb.read(20));
                output.useTailCall = false;
                return output;
            case n === 105:
                output.scriptHash = u_1.reverseHex(sb.read(20));
                output.useTailCall = true;
                return output;
            case n === 241:
                break;
            default:
                throw new Error(`Encounter unknown byte: ${b}`);
        }
    }
    if (output.scriptHash === "") {
        throw new Error("No Scripthash found!");
    }
    return output;
}
exports.default = ScriptBuilder;
//# sourceMappingURL=ScriptBuilder.js.map