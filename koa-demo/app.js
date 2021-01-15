// 配置路由，注意：express中默认自带路由
// 中间件走的洋葱模型，类似栈FILO：注意 12345 的顺序
// __dirname 当前项目的入口即 pack，注意是绝对地址
// routes 文件夹为模块路由，后期根据脚手架对应模块开发
// console.log(__dirname)
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var session = require('koa-session');
var render = require('koa-art-template');
var serve = require('koa-static');
var views = require('koa-views');
var path = require('path');
var common = require('./utils/common')
var Db = require('./utils/db')
// var Router = require('koa-router');
// var router = new Router();
var app = new Koa();
var router = require('koa-router')();
// 引入路由模块
var admin = require('./routes/admin')
var index = require('./routes/index')
/**
 * param root 视图位置
 * param extname 后缀名
 * param debug 是否开启调试模式
 * how to use: await ctx.render('user')
 */
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})


// 配置 session 中间件
/**
 * param rolling 每次请求强制设置 cookie，将重置 cookie 过期时间
 * param renew: (boolean) renew session when session is nearly expired
 * param maxAge 最好设置大一点，当 rolling 和 renew 都为 false 时，用户在编辑文章，容易退出登录且失去数据。
 */
app.keys = ['some secret hurr']

const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: true
}
app.use(session(CONFIG, app));

// 第三方中间件
// 配置模板引擎
// 1.这种方式配置，模板后缀名要为 .ejs
// app.use(views([__dirname], { extension: [_module] }))
app.use(views('views', { extension: 'ejs' }))
app.use(bodyParser())
// 静态资源比如 link 标签，默认去根目录下的 static 目录查找，不论结果都会 next()
// 可配置多个静态 web 服务地址
app.use(serve('static'))
app.use(serve('common'))
// app.use(serve(__dirname +'/static'))

// 2.这种方式配置，模板后缀名要为 .html
// app.use(views('views', { map: { html: 'ejs' }})) 


/**
 * param callback(ctx, next)
 * 应用级中间件，继续向下匹配路由
 */
app.use(async (ctx, next) => {
  // ctx.body = 'hello_world!';
  console.log(`中间件1`);
  // ejs render 全局参数
  ctx.state = {
    globalUser: 'yuql'
  }
  // important !!!!!!!!!!!!! await next() 必须写
  await next();
  // 错误处理中间件
  console.log(`错误处理中间件5`)
  if (ctx.status === 404) {
    // 不重新赋值404 会导致变为200
    ctx.status = 404
    ctx.body = 'this is a 404 page!'
  } else {
    console.log('洋葱5')
  }
});
app.use(async (ctx, next) => {
  // ctx.body = 'hello_world!';
  console.log(`中间件2`);
  await next();
  // 错误处理中间件
  console.log(`错误处理中间件4`)
  if (ctx.status === 404) {
    // 不重新赋值404 会导致变为200
    ctx.status = 404
    ctx.body = 'this is a 404 page!'
  } else {
    console.log('洋葱4')
  }
});
// 默认加载首页
router.use('/', index)
// ctx 包含 req, res 的信息
// next 路由级中间件
router.get('/', async (ctx, next) => {
  // ctx.body 相当于 express 中 http 服务器模块的 res.writeHead() res.end()
  // ctx.render 模板引擎渲染，调用 __dirname 中的 home.ejs
  ctx.cookies.set('username', 'admin', {
    maxAge: 60 * 60 * 1000
  })
  console.log(ctx.session.role)
  // 中文 cookie
  let ur = new Buffer('张三').toString('base64')
  ctx.cookies.set('chinalanguageur', ur, {
    maxAge: 60 * 60 * 1000
  })
  // 数据库封装及错误捕获
  // id = ctx.query.id // URL 上也有 querystring
  // let dbRes = await Db.find('user', {"_id": Db.getId(id)})
  // try {
  //   if (dbRes.result...)
  // } catch (error) {
  //   console.log(error)
  //   ctx.redirect('/')
  // }
  let title = 'hello'
  let html_content = '<h3 style="color:red">hello h3 red<h3>'
  let obj = {
    stand: 'stand'
  }
  let arr = ['zhangsan', 'lisi', 'wangwu']
  // 一定要加 await，render 是异步的。
  await ctx.render('home', {
    title: title,
    htmlCt: html_content,
    obj: obj,
    arr: arr
  })
})
  // next 路由级中间件
  // 没有 ctx.body 的设置则 status === 404
  .get('/news', async (ctx, next) => {
    let username = ctx.cookies.get('username')
    let ur = ctx.cookies.get('chinalanguageur')
    let data = new Buffer(ur, 'base64').toString()
    console.log(data)
    console.log(username)
    console.log(`路由中间件3`)
    console.log(ctx.query)
    console.log(ctx.params)
    ctx.body = `no_aid!`;
    // 跳转
    // ctx.redirect('/')
    await next;
  })
  // 获取 get 传值：http"//localhost:3000/news?aid=123
  // ctx.url
  // ctx.request
  // ctx.query === ctx.request.query
  // ctx.querystring === ctx.request.querystring
  // ctx.params 动态路由 '/news/:aid/:bid'

  // ctx.query.id 获取 URL·querystring 上的 id 值
  // ctx.request.body.id 获取请求体


  .get('/news/:aid', async (ctx) => {
    console.log(ctx.query)
    console.log(ctx.params)
    ctx.body = `aid!${ctx.params.aid}`;
  })

  .get('/login', async (ctx) => {
    ctx.session.role = 'admin'
    ctx.body = '登录成功'
  })


  // 原生 nodejs 在 koa 中获取表单提交的数据
  // .post('/doAdd', async (ctx) => {
  //   var data = await common.getPostData(ctx)
  //   console.log(data)
  //   ctx.body = data
  // })
  // 利用 bodyparser 中间件在 koa 中获取表单提交的数据
  .post('/doAdd', async (ctx) => {
    ctx.body = ctx.request.body
  })
// 启动模块路由
router.use('/admin', admin)
// start router
// allowedMethods: 容错根据 ctx.status 设置 响应header 
app.use(router.routes())
  .use(router.allowedMethods());
app.listen(3000);

