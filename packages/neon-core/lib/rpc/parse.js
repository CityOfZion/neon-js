"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const u_1 = require("../u");
function buildParser(...args) {
    return (result) => {
        if (result.stack.length !== args.length) {
            throw new Error(`Wrong number of items to parse! Expected ${args.length} but got ${result.stack.length}!`);
        }
        return result.stack.map((item, i) => args[i](item));
    };
}
exports.buildParser = buildParser;
function NoOpParser(item) {
    return item.value;
}
exports.NoOpParser = NoOpParser;
function IntegerParser(item) {
    return parseInt(item.value || "0", 10);
}
exports.IntegerParser = IntegerParser;
function StringParser(item) {
    return u_1.hexstring2str(item.value);
}
exports.StringParser = StringParser;
function Fixed8Parser(item) {
    return u_1.Fixed8.fromReverseHex(item.value);
}
exports.Fixed8Parser = Fixed8Parser;
/**
 * Parses the VM Stack and returns human readable strings
 * @param res RPC Response
 * @return Array of results
 */
function SimpleParser(res) {
    return res.stack.map(item => {
        switch (item.type) {
            case "ByteArray":
                return StringParser(item);
            case "Integer":
                return IntegerParser(item);
            default:
                throw Error(`Unknown type: ${item.type}`);
        }
    });
}
exports.SimpleParser = SimpleParser;
//# sourceMappingURL=parse.js.map