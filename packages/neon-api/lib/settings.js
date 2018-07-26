"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = {
    httpsOnly: false
};
function set(newSettings) {
    Object.keys(exports.settings).forEach(key => {
        if (newSettings.hasOwnProperty(key)) {
            exports.settings[key] = !!newSettings[key];
        }
    });
}
exports.set = set;
exports.default = exports.settings;
//# sourceMappingURL=settings.js.map