"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const u_1 = require("../../u");
const wallet_1 = require("../../wallet");
class Witness {
    static deserialize(hex) {
        const ss = new u_1.StringStream(hex);
        return this.fromStream(ss);
    }
    static fromStream(ss) {
        const invocationScript = ss.readVarBytes();
        const verificationScript = ss.readVarBytes();
        return new Witness({ invocationScript, verificationScript });
    }
    static fromSignature(sig, publicKey) {
        const invocationScript = "40" + sig;
        const verificationScript = wallet_1.getVerificationScriptFromPublicKey(publicKey);
        return new Witness({ invocationScript, verificationScript });
    }
    constructor(obj) {
        if (!obj ||
            obj.invocationScript === undefined ||
            obj.verificationScript === undefined) {
            throw new Error("Witness requires invocationScript and verificationScript fields");
        }
        this.invocationScript = obj.invocationScript;
        this.verificationScript = obj.verificationScript;
    }
    serialize() {
        const invoLength = u_1.num2VarInt(this.invocationScript.length / 2);
        const veriLength = u_1.num2VarInt(this.verificationScript.length / 2);
        return (invoLength + this.invocationScript + veriLength + this.verificationScript);
    }
    export() {
        return {
            invocationScript: this.invocationScript,
            verificationScript: this.verificationScript
        };
    }
    equals(other) {
        return (this.invocationScript === other.invocationScript &&
            this.verificationScript === other.verificationScript);
    }
}
exports.Witness = Witness;
exports.default = Witness;
//# sourceMappingURL=Witness.js.map