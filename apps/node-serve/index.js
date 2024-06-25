/*
 * @Author: CP
 * @Date: 2024-01-08 09:21:31
 * @Description:
 */
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const responseDTO = require('./middleware/responseDTO');
const loginRouter = require('./controller/login');

const app = new Koa();

// 注册中间件
app.use(bodyparser());
app.use(responseDTO());

// 注册路由
app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());

app.listen(3010, () => {
  console.log('open server localhost:3010');
});

