// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import tsdoceslint from "eslint-plugin-tsdoc";
import globals from 'globals';
export default tseslint.config(
  {
    // Do not lint build outputs
    ignores: [
      "node_modules/",
      "website/",
      "examples/",
      "packages/**/lib/",
      "packages/**/dist/",
      "packages/**/node_modules/",
    ],
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
    ],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      tsdoc: tsdoceslint,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.lint.json'],
      },
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals.node
      }
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
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE"],
          leadingUnderscore: "allow",
        },
      ],
    },
  },
  eslintPluginPrettier,
);
