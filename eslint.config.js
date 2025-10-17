const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["backend/", "node_modules/", "test-app/"],
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
