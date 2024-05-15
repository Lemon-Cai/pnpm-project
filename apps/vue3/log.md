#### 1、2024-05-15日志：
错误：
```node
ESLint: 8.44.0

TypeError: Failed to load plugin '@typescript-eslint' declared in 'apps\vue3\.eslintrc.cjs » @vue/eslint-config-typescript': Class extends value undefined is not a constructor or null
Referenced from: E:\myWork\pnpm-project\node_modules\.pnpm\@vue+eslint-config-typescript@11.0.3_eslint-plugin-vue@9.11.0_eslint@8.44.0_typescript@5.0.4\node_modules\@vue\eslint-config-typescript\index.js
    at Object.<anonymous> (E:\myWork\pnpm-project\node_modules\.pnpm\@typescript-eslint+utils@7.9.0_eslint@8.44.0_typescript@5.0.4\node_modules\@typescript-eslint\utils\dist\ts-eslint\eslint\LegacyESLint.js:12:51)
    at Module._compile (node:internal/modules/cjs/loader:1198:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1252:10)
    at Module.load (node:internal/modules/cjs/loader:1076:32)
    at Function.Module._load (node:internal/modules/cjs/loader:911:12)
    at Module.require (node:internal/modules/cjs/loader:1100:19)
    at require (node:internal/modules/cjs/helpers:119:18)
    at Object.<anonymous> (E:\myWork\pnpm-project\node_modules\.pnpm\@typescript-eslint+utils@7.9.0_eslint@8.44.0_typescript@5.0.4\node_modules\@typescript-eslint\utils\dist\ts-eslint\ESLint.js:5:22)
    at Module._compile (node:internal/modules/cjs/loader:1198:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1252:10)
husky - pre-commit hook exited with code 1 (error)
```

因为给项目安装了 `@typescript-eslint/eslint-plugin` 和 `@typescript-eslint/parser`这个依赖且在 eslintrc中配置该配置
package.json
```js
// ....
 "devDependencies": {
    "@rushstack/eslint-patch": "^1.10.2",
    "@tsconfig/node18": "^2.0.1",
    "@types/node": "^18.16.17",
    "@typescript-eslint/eslint-plugin": "^6.7.2",
    "@typescript-eslint/parser": "^6.7.2",
    "@vitejs/plugin-vue": "^4.2.3",
    "@vitejs/plugin-vue-jsx": "^3.0.1",
    "@vue/eslint-config-prettier": "^7.1.0",
    "@vue/eslint-config-typescript": "^11.0.3",
    "@vue/tsconfig": "^0.4.0",
    "eslint": "^8.39.0",
    "eslint-plugin-prettier": "^5.1.3",
    "eslint-plugin-vue": "^9.11.0",
    "npm-run-all": "^4.1.5",
    "prettier": "^2.8.8",
    "typescript": "~5.0.4",
    "vite": "^4.3.9",
    "vue-tsc": "^1.6.5"
  },
// ....
```
eslintrc.cjs

```js
module.exports = {
  root: true,
  'extends': [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true
        }
      },
    }
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    "vue/valid-template-root": "off",
    "vue/multi-word-component-names": "off",
    "vue/no-multiple-template-root": "off",
    "vue/valid-define-emits": "warn",
    "prefer-const": "off"
  }
}
```

看着错误，像是两个依赖冲突了，所以我把 `@vue/eslint-config-typescript` 和 `@vue/eslint-config-prettier` 卸载了，并把 eslintrc.cjs中的 `'@vue/eslint-config-typescript'`, `'@vue/eslint-config-prettier/skip-formatting'`, 注释调，（ps: 参考vue-admin的配置的）。再次提交还是报错
```node
ESLint: 8.44.0

ESLint couldn't find the config "prettier" to extend from. Please check that the name of the config is correct.

The config "prettier" was referenced from the config file in "E:\myWork\pnpm-project\apps\vue3\.eslintrc.cjs".

If you still have problems, please stop by https://eslint.org/chat/help to chat with the team.

husky - pre-commit hook exited with code 1 (error)
```
因为 eslintrc.cjs 的 extends 中添加了 `'prettier'`， 所以提示缺少依赖
安装 `eslint-plugin-prettier`

第三次提交

```node 
TypeError: Failed to load plugin '@typescript-eslint' declared in 'apps\vue3\.eslintrc.cjs': Class extends value undefined is not a constructor or null
    at Object.<anonymous> (E:\myWork\pnpm-project\node_modules\.pnpm\@typescript-eslint+utils@7.9.0_eslint@8.44.0_typescript@5.0.4\node_modules\@typescript-eslint\utils\dist\ts-eslint\eslint\LegacyESLint.js:12:51)
    at Module._compile (node:internal/modules/cjs/loader:1198:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1252:10)
    at Module.load (node:internal/modules/cjs/loader:1076:32)
    at Function.Module._load (node:internal/modules/cjs/loader:911:12)
    at Module.require (node:internal/modules/cjs/loader:1100:19)
    at require (node:internal/modules/cjs/helpers:119:18)
    at Object.<anonymous> (E:\myWork\pnpm-project\node_modules\.pnpm\@typescript-eslint+utils@7.9.0_eslint@8.44.0_typescript@5.0.4\node_modules\@typescript-eslint\utils\dist\ts-eslint\ESLint.js:5:22)
    at Module._compile (node:internal/modules/cjs/loader:1198:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1252:10)
husky - pre-commit hook exited with code 1 (error)

```

第四次提交。文件检查了没有任何问题，还是eslint提示这个错误

```node
✖ eslint --max-warnings=0:

E:\myWork\pnpm-project\apps\vue3\src\mock\handlers\login.ts
  8:22  error  Parsing error: Unexpected token :

E:\myWork\pnpm-project\apps\vue3\src\mock\handlers\map.ts
  10:22  error  Parsing error: Unexpected token :

E:\myWork\pnpm-project\apps\vue3\src\mock\handlers\tree.ts
  5:22  error  Parsing error: Unexpected token :

E:\myWork\pnpm-project\apps\vue3\src\mock\handlers\upload.ts
  6:35  error  Parsing error: Unexpected token DefaultBodyType

E:\myWork\pnpm-project\apps\vue3\src\views\SearchTree\index.tsx
  22:7  error  Parsing error: Unexpected token <

✖ 5 problems (5 errors, 0 warnings)

husky - pre-commit hook exited with code 1 (error)
```

第五次提交，又变成一开始报错了
```node
ESLint: 8.44.0

TypeError: Failed to load plugin '@typescript-eslint' declared in 'apps\vue3\.eslintrc.cjs » @vue/eslint-config-typescript': Class extends value undefined is not a constructor or null
Referenced from: E:\myWork\pnpm-project\node_modules\.pnpm\@vue+eslint-config-typescript@13.0.0_eslint-plugin-vue@9.11.0_eslint@8.44.0_typescript@5.0.4\node_modules\@vue\eslint-config-typescript\index.js
    at Object.<anonymous> (E:\myWork\pnpm-project\node_modules\.pnpm\@typescript-eslint+utils@7.9.0_eslint@8.44.0_typescript@5.0.4\node_modules\@typescript-eslint\utils\dist\ts-eslint\eslint\LegacyESLint.js:12:51)
    at Module._compile (node:internal/modules/cjs/loader:1198:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1252:10)
    at Module.load (node:internal/modules/cjs/loader:1076:32)
    at Function.Module._load (node:internal/modules/cjs/loader:911:12)
    at Module.require (node:internal/modules/cjs/loader:1100:19)
    at require (node:internal/modules/cjs/helpers:119:18)
    at Object.<anonymous> (E:\myWork\pnpm-project\node_modules\.pnpm\@typescript-eslint+utils@7.9.0_eslint@8.44.0_typescript@5.0.4\node_modules\@typescript-eslint\utils\dist\ts-eslint\ESLint.js:5:22)
    at Module._compile (node:internal/modules/cjs/loader:1198:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1252:10)
husky - pre-commit hook exited with code 1 (error)
```