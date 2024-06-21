/*
 * @Author: CP
 * @Date: 2024-01-08 09:21:31
 * @Description:
 */
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const responseMiddleware = require('./middleware/commonResponse');
const loginRouter = require('./controller/login');

const app = new Koa();

// 注册中间件
app.use(bodyparser());
app.use(responseMiddleware());

// 注册路由
app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());

app.listen(3010, () => {
  console.log('open server localhost:3010');
});

