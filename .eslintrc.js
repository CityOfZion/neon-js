module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  env: {
    es6: true,
    node: true,
  },
  plugins: [],
  extends: ["plugin:prettier/recommended"],
  overrides: [
    {
      files: ["**/*.ts"],
      plugins: ["@typescript-eslint", "eslint-plugin-tsdoc"],
      extends: [
        "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
      ],
      parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
      },
      rules: {
        "tsdoc/syntax": "warn",
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
          },
        ],
        "@typescript-eslint/no-non-null-assertion": ["warn"],
        "@typescript-eslint/camelcase": 0,
        "@typescript-eslint/no-unused-vars": [
          "error",
          { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
        ],
      },
    },
    {
      files: ["**/*.js"],
      extends: ["eslint:recommended", "plugin:prettier/recommended"],
    },
  ],
};
