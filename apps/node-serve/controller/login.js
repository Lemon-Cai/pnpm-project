/*
 * @Author: CP
 * @Date: 2024-01-08 09:36:11
 * @Description:
 */
const path = require('path')
const fs = require('fs')

const jwt = require('jsonwebtoken')
const Router = require('koa-router')
const { TEST_ACCOUNT, SECRET } = require('../utils/constants')
const { requestInterceptor } = require('../middleware/interceptor')
const { generateIdsAndParentIds } = require('../utils')

const router = new Router({
  // prefix: '/api' // 所有请求前缀
})

router.post('/login', (ctx) => {
  const { username, password } = ctx.request.body

  console.log(username, password)

  // 在实际应用中，应该根据用户名从数据库中查询用户信息，并验证密码
  const user = TEST_ACCOUNT.find((u) => u.username === username && u.password === password)

  if (!user) {
    ctx.status = 403
    ctx.fail('登录失败，用户不存在', 400)
    return
  }

  // 生成 token，并设置过期时间为 7 天
  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '7d' })

  // 设置响应体
  ctx.success(
    {
      accessToken: token,
      username: username,
      userId: user.id,
      role: '',
      roleId: '',
      position: '',
      positionId: ''
    },
    '登录成功'
  )
})

// // 无感刷新token,authenticateToken用上之前写的鉴权中间件,鉴别token是否有效
// router.get('/refreshToken',authenticateToken,(req,res) => {
//   const {username,password} = req.user
//   // 新token
//   const token = generateToken({username,password})
//   // 新refreshToken
//   const refreshToken = generateReFreshToken({username,password})
//   res.send({
//     data: {
//       token,refreshToken
//     },
//     success: true,
//   })
// })

router.get('/getUserInfo', requestInterceptor, (ctx) => {
  ctx.body = { msg: ctx.body?.msg, user: ctx.state.user }
})

router.get('/getAllMenus', requestInterceptor, async (ctx) => {
  const filePath = path.resolve(__dirname, '../data', 'menus.json') // 菜单json存放位置

  try {
    const fileContent = fs.readFileSync(filePath, 'utf8') // 读取文件内容
    let menus = JSON.parse(fileContent)
    // 动态生成 id, 请求之后复制到 menu.json中, 已存在的不会在生成
    let flag = await generateIdsAndParentIds(menus)

    // 此时的menus有重新生成的id
    flag && fs.writeFileSync(filePath, JSON.stringify(menus, null, 2))

    // ctx.body = { msg: ctx.body?.msg || '', data: menus };

    ctx.success(menus, ctx.body?.msg || '请求成功')
  } catch (err) {
    console.error('读取文件出错:', err)
    // ctx.body = { msg: ctx.body?.msg, data: null };
    ctx.fail(ctx.body?.msg || err)
  }
})

module.exports = router
