/*
 * @Author: CP
 * @Date: 2024-01-08 11:04:09
 * @Description:
 */

const jwt = require('jsonwebtoken')
const { SECRET } = require('../constants')

// 验证token

const requestInterceptor = (ctx, next) => {
  const { cookies } = ctx

  const token = cookies.get('token')

  if (!token) {
    // 如果token不存在，则返回错误信息
    ctx.status = 401
    ctx.body = { error: 'Unauthorized' }
    return next()
  }

  try {
    const decoded = jwt.verify(token, SECRET)

    // 检查 token 是否过期
    if (decoded.exp < Date.now() / 1000) {
      ctx.status = 403
      ctx.body = { error: 'Token has expired' }
    } else {
      ctx.state.user = decoded
    }
    
    return next()
  } catch (error) {
    ctx.status = 403
    ctx.body = { error: 'Invalid token' }
  }
}

// 成功返回
const successResponse = () => {}

// 失败返回
const errorResponse = () => {}

module.exports = {
  requestInterceptor,
  // 成功返回
  successResponse,
  // 失败返回
  errorResponse
}
