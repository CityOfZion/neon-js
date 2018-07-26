"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../../consts");
const logging_1 = __importDefault(require("../../logging"));
const u_1 = require("../../u");
const wallet_1 = require("../../wallet");
const calculate_1 = require("../calculate");
const components_1 = require("../components");
const txAttrUsage_1 = __importDefault(require("../txAttrUsage"));
const main_1 = require("./main");
const log = logging_1.default("tx");
class BaseTransaction {
    constructor(tx = {}) {
        this.type = 0x00;
        this.version = tx.version || consts_1.TX_VERSION.CONTRACT;
        this.attributes = Array.isArray(tx.attributes)
            ? tx.attributes.map(a => new components_1.TransactionAttribute(a))
            : [];
        this.inputs = Array.isArray(tx.inputs)
            ? tx.inputs.map(a => new components_1.TransactionInput(a))
            : [];
        this.outputs = Array.isArray(tx.outputs)
            ? tx.outputs.map(a => new components_1.TransactionOutput(a))
            : [];
        this.scripts = Array.isArray(tx.scripts)
            ? tx.scripts.map(a => new components_1.Witness(a))
            : [];
    }
    get [Symbol.toStringTag]() {
        return "Transaction";
    }
    /**
     * Transaction hash.
     */
    get hash() {
        return u_1.reverseHex(u_1.hash256(this.serialize(false)));
    }
    addOutput(txOut) {
        this.outputs.push(new components_1.TransactionOutput(txOut));
        return this;
    }
    /**
     * Adds a TransactionOutput. TransactionOutput can be given as a TransactionOutput object or as human-friendly values. This is detected by the number of arguments provided.
     * @param symbol The symbol of the asset (eg NEO or GAS).
     * @param value The value to send.
     * @param address The address to send to.
     */
    addIntent(symbol, value, address) {
        this.outputs.push(components_1.TransactionOutput.fromIntent(symbol, value, address));
        return this;
    }
    /**
     * Add an attribute.
     * @param usage The usage type. Do refer to txAttrUsage enum values for all available options.
     * @param data The data as hexstring.
     */
    addAttribute(usage, data) {
        if (typeof data !== "string") {
            throw new TypeError("data should be formatted as string!");
        }
        this.attributes.push(new components_1.TransactionAttribute({ usage, data }));
        return this;
    }
    /**
     * Add a remark.
     * @param remark A remark in ASCII.
     */
    addRemark(remark) {
        const hexRemark = u_1.str2hexstring(remark);
        return this.addAttribute(txAttrUsage_1.default.Remark, hexRemark);
    }
    addWitness(witness) {
        this.scripts.push(witness);
        return this;
    }
    /**
     * Calculate the inputs required based on existing outputs provided. Also takes into account the fees required through the gas property.
     * @param balance Balance to retrieve inputs from.
     * @param strategy
     * @param fees Additional network fees. Invocation gas and tx fees are already included automatically so this is additional fees for priority on the network.
     */
    calculate(balance, strategy, fees = 0) {
        const { inputs, change } = calculate_1.calculateInputs(balance, this.outputs, new u_1.Fixed8(this.fees).add(fees), strategy);
        this.inputs = inputs;
        this.outputs = this.outputs.concat(change);
        balance.applyTx(this);
        log.info(`Calculated the inputs required for Transaction with Balance: ${balance.address}`);
        return this;
    }
    /**
     * Serialize the transaction and return it as a hexstring.
     * @param {boolean} signed  - Whether to serialize the signatures. Signing requires it to be serialized without the signatures.
     * @return {string} Hexstring.
     */
    serialize(signed = true) {
        let out = "";
        out += u_1.num2hexstring(this.type);
        out += u_1.num2hexstring(this.version);
        out += this.serializeExclusive();
        out += main_1.serializeArrayOf(this.attributes);
        out += main_1.serializeArrayOf(this.inputs);
        out += main_1.serializeArrayOf(this.outputs);
        if (signed) {
            out += main_1.serializeArrayOf(this.scripts);
        }
        return out;
    }
    /**
     * Signs a transaction.
     * @param {Account|string} signer - Account, privateKey or WIF
     * @return {Transaction} this
     */
    sign(signer) {
        if (typeof signer === "string") {
            signer = new wallet_1.Account(signer);
        }
        const signature = wallet_1.sign(this.serialize(false), signer.privateKey);
        log.info(`Signed Transaction with Account: ${signer.label}`);
        this.addWitness(components_1.Witness.fromSignature(signature, signer.publicKey));
        return this;
    }
    export() {
        return {
            type: this.type,
            version: this.version,
            attributes: this.attributes.map(a => a.export()),
            inputs: this.inputs.map(a => a.export()),
            outputs: this.outputs.map(a => a.export()),
            scripts: this.scripts.map(a => a.export())
        };
    }
}
exports.BaseTransaction = BaseTransaction;
exports.default = BaseTransaction;
//# sourceMappingURL=BaseTransaction.js.map