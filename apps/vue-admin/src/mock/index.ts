import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'


const workers = setupWorker(...handlers)

export default workers
