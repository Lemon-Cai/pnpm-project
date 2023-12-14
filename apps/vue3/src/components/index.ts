
import type { App } from 'vue'
import * as components from './components'


export const install = (app: App) => {
  Object.keys(components).forEach((key) => {
    const componentPlugin = components[key as keyof typeof components];
    if (componentPlugin.install) {
      // @ts-ignore
      app.use(componentPlugin)
    }
  })

  // 全局属性
  // app.config.globalProperties.$message = components.message;
}


export default {
  install,
};
