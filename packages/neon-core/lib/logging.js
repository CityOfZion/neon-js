"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loglevel_1 = __importDefault(require("loglevel"));
const loglevel_plugin_prefix_1 = __importDefault(require("loglevel-plugin-prefix"));
loglevel_plugin_prefix_1.default.reg(loglevel_1.default);
loglevel_1.default.setDefaultLevel("silent");
function setAll(lvl) {
    Object.keys(loglevel_1.default.getLoggers()).map(key => {
        const lg = loglevel_1.default.getLogger(key);
        lg.setLevel(lvl);
    });
}
exports.setAll = setAll;
const fn = (level, name, timestamp) => {
    const ts = timestamp ? timestamp : new Date().toUTCString();
    level = level.toUpperCase();
    return `[${ts}] (${name}) ${level}: `;
};
exports.default = (label) => {
    const l = loglevel_1.default.getLogger(label);
    loglevel_plugin_prefix_1.default.apply(l, { format: fn });
    return l;
};
exports.logger = loglevel_1.default;
//# sourceMappingURL=logging.js.map