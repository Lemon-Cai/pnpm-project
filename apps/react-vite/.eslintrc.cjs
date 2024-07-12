/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    "plugin:react/recommended",
    'plugin:@typescript-eslint/recommended',
    "plugin:react/jsx-runtime",
    'plugin:react-hooks/recommended',
    "prettier",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    jsxPragma: "React",
		ecmaFeatures: {
			jsx: true
		}
    // project: true,
    // project: ['./tsconfig.json'], // 修改这里
    // tsconfigRootDir: __dirname,
  },
  // ignorePatterns: ['scripts/*'], // 添加这一行
  plugins: ["react", "@typescript-eslint", 'react-hooks', "prettier"],
  rules: {
    // eslint (http://eslint.cn/docs/rules)
		"no-var": "error", // 要求使用 let 或 const 而不是 var
		// "no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
		"no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们
		"prefer-const": "off", // 此规则旨在标记使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
		// "no-irregular-whitespace": "off", // 禁止不规则的空白
    "no-constant-condition": "off", //

    'react/prop-types': 'off',  // 添加这一行

    '@typescript-eslint/no-non-null-assertion': 'off',
    "@typescript-eslint/no-empty-function": "off", // 空函数
    "@typescript-eslint/no-explicit-any": "off", // 可不可使用any
  },
}
