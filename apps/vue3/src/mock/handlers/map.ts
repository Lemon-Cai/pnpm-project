/*
 * @Author: CP
 * @Date: 2023-11-22 10:49:46
 * @Description: 
 */
import { http, HttpResponse } from 'msw'

import flights from '../data/flingts.json'

export const handlers = [
  http.post('/mock/getFlightsData', async () => {
    return HttpResponse.json(
      {
        msg: '',
        success: true,
        data: flights
      },
      {
        status: 200
      }
    )
  })
]
