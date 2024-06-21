/*
 * @Author: CP
 * @Date: 2024-06-21 08:58:13
 * @Description: 
 */
import { setupWorker  } from 'msw/browser'

import loginHandlers from './handlers/login'

const workers = setupWorker(...loginHandlers)

export default workers