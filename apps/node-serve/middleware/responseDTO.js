/*
 * @Author: CP
 * @Date: 2024-01-08 20:35:06
 * @Description: 统一接口返回格式
 */
function routerResponse(option = {}) {
  return async function (ctx, next) {
    // 定义 ctx.success 方法
    ctx.success = function (data, msg) {
      ctx.type = option.type || 'json';
      ctx.body = {
        code: option.successCode || 200,
        msg: msg || 'success',
        data: data,
        success: true
      };
    };

    // 定义 ctx.fail 方法
    ctx.fail = function (msg, code) {
      ctx.type = option.type || 'json';
      ctx.body = {
        code: code || option.failCode || 99,
        msg: msg || option.failMsg || 'fail',
        success: false
      };
    };

    await next();

    // 检查是否已经设置了响应体，避免重复设置
    if (!ctx.body) {
      ctx.body = {
        code: option.successCode || 200,
        msg: 'No response body set'
      };
    }
  };
}

module.exports = routerResponse;
