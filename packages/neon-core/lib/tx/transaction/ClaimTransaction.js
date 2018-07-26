"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../../consts");
const u_1 = require("../../u");
const wallet_1 = require("../../wallet");
const components_1 = require("../components");
const BaseTransaction_1 = require("./BaseTransaction");
const main_1 = require("./main");
const MAX_CLAIMS_LENGTH = 255;
class ClaimTransaction extends BaseTransaction_1.BaseTransaction {
    constructor(obj = {}) {
        super(Object.assign({ version: consts_1.TX_VERSION.CLAIM }, obj));
        this.type = 0x02;
        this.claims = Array.isArray(obj.claims)
            ? obj.claims.slice(0, MAX_CLAIMS_LENGTH).map(c => new components_1.TransactionInput(c))
            : [];
    }
    static deserializeExclusive(ss, tx) {
        const out = {
            claims: []
        };
        const claimLength = ss.readVarInt();
        for (let i = 0; i < claimLength; i++) {
            out.claims.push(components_1.TransactionInput.fromStream(ss));
        }
        return Object.assign(tx, out);
    }
    static fromClaims(claim) {
        const totalClaim = claim.claims.reduce((p, c) => {
            return p.add(c.claim);
        }, new u_1.Fixed8(0));
        const outputs = [
            new components_1.TransactionOutput({
                assetId: consts_1.ASSET_ID.GAS,
                value: totalClaim,
                scriptHash: wallet_1.getScriptHashFromAddress(claim.address)
            })
        ];
        const claims = claim.claims.map(c => ({
            prevHash: c.txid,
            prevIndex: c.index
        }));
        return new ClaimTransaction({ outputs, claims });
    }
    get exclusiveData() {
        return { claims: this.claims };
    }
    get fees() {
        return 0;
    }
    addClaims(claim) {
        if (this.claims.length !== 0) {
            throw new Error(`This transaction already has claims!`);
        }
        const totalClaim = claim.claims.reduce((p, c) => {
            return p.add(c.claim);
        }, new u_1.Fixed8(0));
        this.outputs.push(new components_1.TransactionOutput({
            assetId: consts_1.ASSET_ID.GAS,
            value: totalClaim,
            scriptHash: wallet_1.getScriptHashFromAddress(claim.address)
        }));
        this.claims = claim.claims.map(c => new components_1.TransactionInput({
            prevHash: c.txid,
            prevIndex: c.index
        }));
        return this;
    }
    serializeExclusive() {
        return main_1.serializeArrayOf(this.claims);
    }
    equals(other) {
        if (this.type !== other.type) {
            return false;
        }
        if (other instanceof ClaimTransaction) {
            return this.hash === other.hash;
        }
        return this.hash === new ClaimTransaction(other).hash;
    }
    export() {
        return Object.assign(super.export(), {
            claims: this.claims.map(c => c.export())
        });
    }
}
exports.ClaimTransaction = ClaimTransaction;
exports.default = ClaimTransaction;
//# sourceMappingURL=ClaimTransaction.js.map