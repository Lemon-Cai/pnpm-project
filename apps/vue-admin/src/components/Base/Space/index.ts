/*
 * @Author: CP
 * @Date: 2024-05-21 14:41:19
 * @Description: 
 */
import CSpace from './src/space'
import type { App } from 'vue'

// import { withInstall } from '@/components/util'

CSpace.install = (Vue: App) => {
  Vue.component(CSpace.name, CSpace)
}
// export default withInstall(CSpace)
export default CSpace