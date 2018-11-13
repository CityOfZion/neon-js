const config = require("../../jest.config");
config.globals["ts-jest"]["tsConfigFile"] = "../../tsconfig-test.json";
config.testRegex = "./(__(tests|integration)__/NeoNS)\\.ts$";
module.exports = config;
