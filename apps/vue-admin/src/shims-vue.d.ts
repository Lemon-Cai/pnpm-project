
// 可能是vue版本问题， main.ts中 
// import App from '@/App.vue' 报错： Cannot find module './App.vue' or its corresponding type declarations.ts(2307)
// 这个是 vue2 的声明方式
// declare module '*.vue' {
//   import { Component } from 'vue'
//   const component: Component
//   export default component
// }

// vue3 的声明方式
// declare module "*.vue" {
//   import { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }