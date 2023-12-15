
import { setupWorker } from 'msw/browser'

import loginHandlers from './handlers/login'

const workers = setupWorker(...loginHandlers)

export default workers
