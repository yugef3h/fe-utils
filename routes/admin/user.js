// 模块路由
// CURD
var router = require('koa-router')();
// /admin
router.get('/', async (ctx) => {
  await ctx.render('admin/user')
})
router.get('/add', async (ctx) => {
  ctx.body = 'admin/user/add'
})
router.get('/update', async (ctx) => {
  ctx.body = 'admin/user/update'
})
router.get('/find', async (ctx) => {
  ctx.body = 'admin/user/find'
})
router.get('/delete', async (ctx) => {
  ctx.body = 'admin/user/delete'
})

module.exports = router.routes() // 暴露同时启动路由