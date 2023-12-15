/*
 * @Author: CP
 * @Date: 2023-11-22 10:49:46
 * @Description: 
 */
import { http, HttpResponse, delay } from 'msw'

const handlers = [
  http.post('/mock/login', async ({ request, params }) => {
    // 等待200ms
    delay(200)
    console.log(params, request)

    return HttpResponse.json(
      {
        msg: '',
        success: true,
        data: {
          username: 'admin',
          pwd: '123456'
        }
      },
      {
        status: 200
      }
    )
  }),
  http.post('/mock/getAllMenu', async ({ request, params }) => {
    // 等待200ms
    delay(200)
    console.log(params, request)

    return HttpResponse.json(
      {
        msg: '',
        success: true,
        data: {
          username: 'admin',
          pwd: '123456'
        }
      },
      {
        status: 200
      }
    )
  })
]

export default handlers