// 模块路由
// CURD
var router = require('koa-router')();
// /admin
router.get('/', async (ctx) => {
  ctx.body = 'admin/manage'
})
router.get('/add', async (ctx) => {
  ctx.body = 'admin/manage/add'
})
router.get('/update', async (ctx) => {
  ctx.body = 'admin/manage/update'
})
router.get('/find', async (ctx) => {
  ctx.body = 'admin/manage/find'
})
router.get('/delete', async (ctx) => {
  ctx.body = 'admin/manage/delete'
})

module.exports = router.routes() // 暴露同时启动路由