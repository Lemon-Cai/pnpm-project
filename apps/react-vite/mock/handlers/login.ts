/*
 * @Author: CP
 * @Date: 2023-11-22 10:49:46
 * @Description:
 */
import { http, HttpResponse, delay } from 'msw'
import { generateIdsAndParentIds, generateToken, /* verifyToken */ } from '../util'

// import fs from 'fs'
// import path from 'path'


// 账户
export const TEST_ACCOUNT = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
  },
];

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
  http.get(
    '/mock/getAllMenu',
    async () => {

      let globPath = '../data/menu.json'
      const result: Record<string, any> = await import.meta.glob('../data/menu.json', { eager: true })
      
      const menus = result[globPath]?.default || []

      // 动态生成 id, 请求之后复制到 menu.json中, 已存在的不会在生成
      let flag = generateIdsAndParentIds(menus)

      console.log('All menus = ', menus);

      // 此时的menus有重新生成的id
      if (flag) {
        // 更新menus.json 
        // const filePath = new URL(globPath, import.meta.url).pathname; // 使用URL对象替代path.resolve

        // const filePath = path.resolve(__dirname, 'data', 'menu.json')
        // try {
        //   // const fileContent = fs.readFileSync(filePath, 'utf8') // 读取文件内容
        //   // let data = JSON.parse(fileContent)
        //   // data.hash = nanoid() // 生成唯一的哈希值
        //   fs.writeFileSync(filePath, JSON.stringify(menus, null, 2))
        // } catch (err) {
        //   console.error('读取文件出错:', err)
        // }
      }

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
