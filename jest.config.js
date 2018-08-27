module.exports = {
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsConfigFile: "<rootDir>/tsconfig-test.json"
    }
  },
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  coveragePathIgnorePatterns: [
    "<rootDir>/packages/.*/lib/",
    "<rootDir>/packages/.*/dist/"
  ],
  testRegex:
    "(/packages/.*/__(tests|integration)__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
