
// import type { App } from 'vue'
import { withInstall } from '../util'
import Table from './index.vue'

export default withInstall(Table)

// export default Object.assign(Table, {
//   install: function (app: App) {
//     app.component(Table.name, Table)
//   }
// })