const config = require("../../jest.config");
config.globals["ts-jest"]["tsconfig"] = "../../tsconfig-test.json";
module.exports = config;
