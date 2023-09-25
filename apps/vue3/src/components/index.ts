
import type { App } from 'vue'
import * as components from './components'


export const install = (app: App) => {
  Object.keys(components).forEach((key) => {
    const component = components[key as keyof typeof components];
    if (component.install) {
      app.use(component)
    }
  })

  // 全局属性
  // app.config.globalProperties.$message = components.message;
}


export default {
  install,
};
