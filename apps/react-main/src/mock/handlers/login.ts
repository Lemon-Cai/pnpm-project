/*
 * @Author: CP
 * @Date: 2023-11-22 10:49:46
 * @Description:
 */
import { http, HttpResponse, delay } from 'msw'
import { TEST_ACCOUNT } from '@/config/constants'
import { generateIdsAndParentIds, generateToken, /* verifyToken */ } from '../util'

const handlers = [
  http.post('/mock/login', async ({ request, params }) => {
    // 等待200ms
    delay(100)
    console.log(params, request)

    const requestBody = (await request.json()) as { username: string; password: string }
    const { username, password } = requestBody

    // 在实际应用中，应该根据用户名从数据库中查询用户信息，并验证密码
    const user = TEST_ACCOUNT.find((u) => u.username === username && u.password === password)

    if (!user) {
      return HttpResponse.json(
        {
          msg: '登录失败',
          success: false,
          code: 200
          // data: undefined
        },
        {
          // status: 401
        }
      )
    }

    // 生成 token
    const token = generateToken(user)

    return HttpResponse.json(
      {
        msg: '',
        success: true,
        code: 200,
        data: {
          // 个人信息
          accessToken: token,
          username: 'admin',
          pwd: '123456'
        }
      },
      {
        status: 200
      }
    )
  }),
  http.post(
    '/mock/getAllMenu',
    async ({ request, params }) => {

      console.log(params, request)

      const menus = require('../data/menu.json')
      console.log('allMenus', menus)

      // 动态生成 id, 请求之后复制到 menu.json中, 已存在的不会在生成
      generateIdsAndParentIds(menus)

      return HttpResponse.json(
        {
          msg: '',
          success: true,
          data: menus
        },
        {
          status: 200
        }
      )
    }
  )
]

export default handlers
