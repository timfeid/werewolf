module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/typescript/recommended",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "promise/always-return": "never",
    "promise/catch-or-return": "never",
    "promise/no-callback-in-promise": "never",
    "promise/no-nesting": "never",
    "promise/no-promise-in-callback": "never",
    "no-const-assign": "warn",
    "no-this-before-super": "warn",
    "no-undef": "warn",
    "no-unreachable": "warn",
    "new-cap": [
      "error",
      {
        capIsNewExceptions: ["Prop", "Component", "Watch", "Module"]
      }
    ],
    "no-unused-vars": "warn",
    "vue/no-use-v-if-with-v-for": "off",
    semi: [2, "never"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "always",
        asyncArrow: "always"
      }
    ],
    curly: ["error", "all"],
    "require-jsdoc": "off",
    "valid-jsdoc": "off",
    "max-len": "off",
    "no-invalid-this": "off",
    "constructor-super": "warn",
    "valid-typeof": "warn",
    "vue/require-v-for-key": "off",
    "array-bracket-spacing": "error"
  },
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  overrides: [
    {
      files: ["**/__tests__/*.{j,t}s?(x)"],
      env: {
        mocha: true
      }
    }
  ]
}
