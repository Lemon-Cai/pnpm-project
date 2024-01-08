/*
 * @Author: CP
 * @Date: 2024-01-08 09:36:11
 * @Description: 
 */

const Router = require("koa-router");
const jwt = require('jsonwebtoken')

const { TEST_ACCOUNT, SECRET } = require('../constants')
const { requestInterceptor } = require('../interceptor/index')


const router = new Router({
  // prefix: '/api' // 所以请求前缀
});

router.post('/login', (ctx, next) => {

  const { username, password } = ctx.request.body

  console.log(username, password);

  // 在实际应用中，应该根据用户名从数据库中查询用户信息，并验证密码
  const user = TEST_ACCOUNT.find((u) => u.username === username && u.password === password);

  if (!user) {
    ctx.status = 403
    ctx.fail('登录失败，用户不存在', 400)
    return next()
  }

  // 生成 token，并设置过期时间为 1 天/小时
  const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '1d' });

  // 在实际应用中，可以返回更多信息，如用户信息等
  res.json({ token });

  // ctx.body = '登录接口'
  ctx.success({
    accessToken: token,
    username: username,
    userId: user.id,
    role: '',
    roleId: '',
    position: '',
    positionId: ''
  }, '登录成功')

  return next()
})


router.get('/getUserInfo', requestInterceptor, (ctx, next) => {
  ctx.body = { msg: ctx.body.error, user: ctx.state.user };
  return next()
})

module.exports = router