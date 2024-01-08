/*
 * @Author: CP
 * @Date: 2024-01-08 13:17:42
 * @Description: 
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
      createProxyMiddleware('/api', {
        target : 'http://localhost:3010',
        changeOrigin : true,
        ws: true,
        pathRewrite : {
            '^/api' : ''
        },
    })
  );
};