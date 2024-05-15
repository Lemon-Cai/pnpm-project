/*
 * @Author: CP
 * @Date: 2024-05-13 15:04:59
 * @Description: 
 */

import { http, HttpResponse, RequestHandler } from 'msw'



export const handlers: RequestHandler[] = [
  http.get('/mock/getTree', async ({ request, params }) => {
    
    console.log(params, request)

    let path = '../data/treeData.json'

    const treeData: Record<string, any> = import.meta.globEager('../data/treeData.json')
    const data: any = treeData[path]!.default || {};

    return HttpResponse.json(
      data,
      {
        status: 200
      }
    )
  })
]