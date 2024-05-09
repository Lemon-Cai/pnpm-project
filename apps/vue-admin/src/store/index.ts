import { createPinia } from "pinia";
import { createPersistedState } from 'pinia-plugin-persistedstate'


// 创建store，配置可持久化，避免刷新导致数据丢失
const pinia = createPinia()
pinia.use(
  createPersistedState({
    // storage: sessionStorage,
    key: (id) => `__cp__${id}`, // 存储的key会自动拼接 __cp__ 前缀
  })
)


export default pinia;