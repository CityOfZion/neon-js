const config = require("../../jest.config");
config.globals["ts-jest"]["tsConfig"] = "../../tsconfig-test.json";
config.testRegex = "./(__(tests|integration)__/.*)\\.ts$";
module.exports = config;
