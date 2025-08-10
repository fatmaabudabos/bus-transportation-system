export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    ignores: [
      "node_modules",
      "dist",
      "coverage"
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly" 
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
];
