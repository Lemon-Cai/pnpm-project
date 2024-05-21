import CPButton from './src/button'
import type { App } from 'vue'

CPButton.install = (Vue: App) => {
    Vue.component(CPButton.name, CPButton)
}

export default CPButton