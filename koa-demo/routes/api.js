// api 接口
var router = require('koa-router')();
router.get('/findPages', async (ctx) => {
  ctx.body = {
    result: '返回前 10 页数据，仿照接口'
  }
})
module.exports = router.routes()