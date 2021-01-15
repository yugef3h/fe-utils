// 前台首页
// 如果模块不多，不必像后台 admin 那样分模块，自己度量


// 模块路由
// 外部启动后路径前缀为 /admin
var router = require('koa-router')();
// /admin
router.get('/', async (ctx) => {
  ctx.body = 'cms home'
})
// 前台和后台匹配路由的写法不一样
router.use('about', async (ctx) => {
  ctx.body = 'cms about'
})
router.use('register', async (ctx) => {
  ctx.body = 'cms register'
})


module.exports = router.routes() // 暴露同时启动路由