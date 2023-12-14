/*
 * @Author: CP
 * @Date: 2023-11-20 13:59:02
 * @Description:
 */
import { http, HttpResponse, type DefaultBodyType, delay } from 'msw'

/**
 *  https://mswjs.io/docs/migrations/1.x-to-2.x#ctxset
 * 
1.x 写法
rest.get('/resource', (req, res, ctx) => {
  return res(ctx.status(201))
})

2.x 版本
http.get('/resource', ({ request, params }) => {
  return new HttpResponse({ id: 'abc-123' }, {
    status: 201,
    headers: {
      'X-Custom-Header': 'foo',
      'Set-Cookie': 'token=abc-123',
    },
  })
})
 * 
 */
export const handlers = [
  // http.get('/resource/asFetch', () => {
  //   return new Response(JSON.stringify({ id: 'abc-123' }), {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  // }),
  // http.get('/resource/status', () => {
  //   return new HttpResponse(null, {
  //     status: 201,
  //   })
  // }),
  // http.get('/resource', () => {
  //   return HttpResponse.json({ id: 'abc-123' })
  // }),

  // http.get(`/api/articles/:id`, ({ request, params, cookies, context }) => {
  //   const { id } = params;
  //   // const data = articles.find((item) => item.id === parseInt(id, 10));
  //   // if (data) {
  //   //     return res(ctx.status(200), ctx.json(data));
  //   // } else {
  //   //     return res(ctx.status(500));
  //   // }
  //   return HttpResponse.json({ id: 'aaa-123', records: [] }, {
  //     status: 200,

  //   })
  // }),

  // 测试上传进度
  http.post('/mock/allcore/testProgress', async ({ request }) => {
    await delay(1000) // 模拟网络延迟

    const formData = await request.formData()
    console.log(formData);

    return HttpResponse.json(
      {
        msg: '',
        success: true,
        data: []
      },
      {
        status: 200
      }
    )
  }),

  http.get('/mock/allcore/checkFolder', async ({ request, params }) => {
    // const obj = await request.json()
    // request.headers.set('Content-Type', 'application/json')
    console.log(params, request)

    const url = new URL(request.url)
    let fileFolder: any = url.searchParams.getAll('fileFolder')
    // console.log('fileFolder', fileFolder)
    if (fileFolder) fileFolder = JSON.parse(fileFolder)

    // const formData = await request.formData()
    // const fileFolder = formData.get('fileFolder')

    return HttpResponse.json(
      {
        msg: '',
        success: true,
        data: {
          successList: fileFolder || []
        }
      },
      {
        status: 200
      }
    )
  }),
  http.post('/mock/allcore/upload', async ({ request }) => {
    request.headers.set('Content-Type', 'application/json;uft-8')

    // console.log(request)

    const json: DefaultBodyType = await request.json()
    // console.log(json)

    const { fileDtoList = [] } = json as any

    const newList = fileDtoList.map((item: any) => {
      return {
        ...item,
        urlDtoList: Array.from(new Array(item.chunks).fill(0)).map((item, idx) => ({
          partyUploadUrl: '',
          partNumber: idx
        }))
      }
    })

    return HttpResponse.json(
      {
        msg: '',
        data: newList,
        success: true,
        code: 200
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json;uft-8'
        },
        status: 200
      }
    )
  }),
  http.post('/mock/allcore/uploadChunk', async ({ request }) => {
    const formData = await request.formData()
    
    console.log('formData=', formData.get('chunk'));

    return HttpResponse.json(
      {
        msg: '',
        data: {},
        success: true
      },
      {
        // 响应头设置
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json;uft-8'
        },
        status: 200
      }
    )
  }),
  http.put('/mock/allcore/uploadChunk', async ({ request }) => {
    const arrayBuffer = await request.arrayBuffer()
    
    console.log(arrayBuffer);

    return HttpResponse.json(
      {
        msg: '',
        data: {},
        success: true
      },
      {
        // 响应头设置
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json;uft-8'
        },
        status: 200
      }
    )
  }),
  http.post('/mock/allcore/mergeChunk', async ({ request }) => {
    console.log(request);
    return HttpResponse.json(
      {
        msg: '',
        data: {},
        success: true
      },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json;uft-8'
        },
        status: 200
      }
    )
  }),
]
