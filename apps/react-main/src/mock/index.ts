/*
 * @Author: CP
 * @Date: 2023-12-15 11:19:21
 * @Description: 
 */

import { setupServer  } from 'msw/node'
// import { setupWorker  } from 'msw/browser'

import loginHandlers from './handlers/login'

const workers = setupServer(...loginHandlers)

export default workers
