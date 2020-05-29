// 模块路由
// 外部启动后路径前缀为 /admin
var router = require('koa-router')();
var user = require('./admin/user')
var manage = require('./admin/manage')
// /admin
router.get('/', async (ctx) => {
  ctx.body = 'cms home'
})
// 模块内的子路由，参考 vue 左导航
router.use('/user', user) // 里面包含 user 的 curd
router.use('/manage', manage) // 里面包含 user 的 curd


module.exports = router.routes() // 暴露同时启动路由