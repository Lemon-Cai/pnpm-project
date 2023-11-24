/*
 * @Author: CP
 * @Date: 2023-11-22 10:49:46
 * @Description: 
 */
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/mock/login', async ({ request, params }) => {
    // 接受参数为 application/json
    // const requestBody = await request.json()

    // request.headers.set('Content-Type', 'application/json')
    console.log(params, request)
    // const url = new URL(request.url)
    
    // console.log(url, url.searchParams.getAll('fileFolder'));

    // 接受参数为： FormData
    // const formData = await request.formData()
    // console.log(formData, formData.get('fileFolder'));

    // 接受二进制流
    // await request.arrayBuffer()

    // const headers = request.headers
    // const entry = headers.entries()
    // let next = entry.next()
    // while(!next.done) {
    //   console.log(next);
    //   next = entry.next()
    // }

    return HttpResponse.json(
      {
        msg: '',
        success: true,
        data: {
          username: 'cp',
          pwd: '123456'
        }
      },
      {
        status: 200
      }
    )
  })
]
