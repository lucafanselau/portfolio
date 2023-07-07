/* eslint-env node */
module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "prettier",
    "next/core-web-vitals",
  ],
  rules: {
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/no-children-prop": "off",
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "@typescript-eslint/semi": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "@typescript-eslint/no-empty-function": "off",
  },
  ignorePatterns: ["**/generated/**/*"],
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
};
