/*
 * @Author: CP
 * @Date: 2024-01-08 09:21:31
 * @Description: 
 */
const Koa = require("koa");

// const Router = require("koa-router");
const body = require("koa-body");
const responseMiddleware = require('./middleware/commonResponse')

// 路由
const loginRouter = require('./controller/login')

const app = new Koa();

app.use(
  body({
    multipart: true,
  })
);

app.use(responseMiddleware)

// 拦截器
// app.use(async (ctx) => {
//   console.log('ctx = ', ctx);
//   const { cookies } = ctx

//   const access_token = cookies.get('access_token')

//   const { Cookie, token, Authorization } = ctx.request.headers;
  
//   // 校验token是否过期
//   if (!token) {

//   }
//   ctx.response.body = 'Hello, koa2!';
// })

// // 测试
// router.get('/:category/:title', (ctx, next) => {
//   console.log(ctx.params);
//   // => { category: 'programming', title: 'how-to-node' }

//   ctx.response.body = ctx.params
// });

// router.get("/", (ctx, next) => {
//   ctx.body = "hello hei";

//   // 文件流
//   // ctx.set('Content-Type', 'text/csv; charset=utf-8')
//   // // 中文必须用 encodeURIComponent 包裹，否则会报 Invalid character in header content ["Content-Disposition"]
//   // ctx.set(
//   //   'Content-Disposition',
//   //   `attachment; filename=${encodeURIComponent('详细数据')}.csv`
//   // )

//   next()
// });

// const router = new Router();

// router.post('/login', (ctx, next) => {})

// app.use(router.routes())

app.use(loginRouter.routes()).use(loginRouter.allowedMethods());

app.listen(3010, () => {
  console.log("open server localhost:3010");
});
