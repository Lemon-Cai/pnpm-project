/*
 * @Author: CP
 * @Date: 2024-07-08 10:52:29
 * @Description: 目前是用于测试
 */
const path = require('path')
const fs = require('fs')

const Router = require('koa-router')
// const send = require('koa-send')

// 中间件
// const { requestInterceptor } = require('../middleware/interceptor')

const router = new Router({
  prefix: '/fileServer' // 所有请求前缀
})

router.get('/download', async (ctx) => {
  // ctx.type = 'text/plain'
  // ctx.type = 'application/octet-stream'

  // Transfer-Encoding 和  Content-Length 不能共存
  ctx.set('Transfer-Encoding', 'chunked')
  // ctx.set('Content-Length', fileStats.size)

  // ctx.set('Content-Disposition', `attachment; filename="menus.json"`)
  // ctx.set('Transfer-Encoding', 'chunked')

  const filePath = path.resolve(__dirname, '../data/menus.json')

  // let fileStats = await fs.promises.stat(filePath)
  // console.log(fileStats)

  const stream = fs.createReadStream(filePath)
  // // // 注入内容
  // stream.pipe(ctx.body)
  ctx.body = stream
})


router.post('/forward', async (ctx) => {
  // const options = {
  //   hostname: 'example.com',
  //   port: 80,
  //   path: '/api/endpoint',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': ctx.headers['content-type'],
  //     'Content-Length': ctx.headers['content-length']
  //   }
  // }

  // 创建转发请求
  // const req = http.request(options, (res) => {
  //   ctx.status = res.statusCode
  //   ctx.set(res.headers)
  //    res.pipe(ctx.res)：将目标服务器的响应数据管道化到客户端的响应中，实现数据转发。
  //   res.pipe(ctx.res)
  // })

  // 将客户端的请求数据从 ctx.req 管道化到目标服务器的请求流中。
  // ctx.req.pipe(req)

  // req.on('error', (e) => {
  //   console.error(`Problem with request: ${e.message}`)
  // })
})

module.exports = router
