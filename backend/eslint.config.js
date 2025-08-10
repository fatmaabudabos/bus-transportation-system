import globals from "globals";

export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    ignores: [
      "node_modules",
      "scripts"
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,     
        fetch: "readonly"    
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
