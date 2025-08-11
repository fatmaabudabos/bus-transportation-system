export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    ignores: [
      "node_modules", "scripts"
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        fetch: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
