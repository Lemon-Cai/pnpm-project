import { http, HttpResponse, RequestHandler } from 'msw'

export const handlers: RequestHandler[] = [
  http.get('/mock/getTree', async ({ request, params }) => {
    console.log(params, request)

    let path = '../data/treeData.json'

    const treeData: Record<string, any> = import.meta.globEager('../data/treeData.json')
    const data: any = treeData[path]!.default || {}

    return HttpResponse.json(data, {
      status: 200
    })
  }),
  http.get('/mock/getTreeOfChildren', async () => {
    return HttpResponse.json(
      {
        msg: '',
        data: [],
        success: true
      },
      {
        status: 200
      }
    )
  })
]
