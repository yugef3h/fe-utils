#npm update <package>                                                     node_modules 对应包更新至最新
#npm update <package> -g                                                  全局对应包更新至最新
#npm install -g supervisor                                                热更新
#npm install mongodb --save
#npm install koa --save
#npm install koa-router --save
#npm install koa-views --save                                             模块引擎
#npm install koa-bodyparser --save                                        提交 post 请求获取表单
#npm install koa-static --save                                            静态 web 服务

#npm install ejs --save                                                   模块引擎
#npm install art-template --save                                          模板引擎，[代替ejs]
#npm install koa-art-template --save                                      模板引擎

#npm install koa-session --save       

#npm install koa-generator -g                                             koa 应用生成器，类似 vue-cli，命令：koa projectName                     

# delete node_modules or other files
npm install rimraf -g
rimraf node_modules

# create package.json
npm init

"main": "./utils/main.js" 调用模块

#npm i silly-datetime --save 格式化日期
#npm i mkdirp --save 一键创建层级文件夹（无则创建、有同名文件则删除）
#npm i ejs --save 模板引擎，动态渲染web页面



# fs
// writeFile一键创建覆盖文件
// appendFile一键创建追加文件
// rename一键重命名+移动文件
// unlink删除文件
// fs.writeFile('./test.txt', 'test content', (err) => { return }) 
// createReadStream大文件流操作，on监听 'data', 'end', 'error' 
// createWriteStream写入流，obj.write([数据内容], 'UTF8')  obj.end() 标记文件末尾，on监听 'finish', 'error';
// readerStream.pipe(writerStream)文件复制管道流，复制时还能修改文件名
// path.extname获取后缀名
// url.parse([URL地址])解析URL
// var data = fs.readFileSync同步读取

# querystring
// querystring.parse('username=yuql&age=17')解析 querystring

# 静态 web 服务器
1.获取请求地址 
  url.parse(req.url, true).pathname, boolean 将 query 字符串解析成对象
  处理 404 跳转和默认根目录 '/'
2.通过 fs 模块读取文件 readFileSync

# 动态 EJS
1.ejs.renderFile([x.ejs], {}, ed_callback)
<% if (user) { %>
  <h2><%= user.name %></h2>
<% } %>

2.获取 POST 传值
let postData = ''
req.on('data', (chunk) => { postData+=chunk })
req.on('end', () => { try...catch })

req.method
req.url
req.body

# google：需要一个解析文件类型 content-type 的库

# mongodb: 查看 nodejs 应用文档 http://mongodb.github.io/node-mongodb-native/3.5/quick-start/quick-start/
1.mongo                                                                   回车建立连接
2.mongo 196.168.0.1:27017                                                 回车建立远程连接                                     
3.show dbs                                                                展示所有数据库
4.use testdb                                                              切换到 testdb库，才能进行以下操作
  show collections                                                        查看该库中的表列表
  db.user.drop()                                                          删除该表
  db.dropDatabase()                                                       删除该库
  db.user.insert({"username": "zhangsan"})                                插入第一条数据，数据库和表正式建立，否则 show dbs 是查不到这个切换的库的。
  db.user.find()                                                          查看表数据
        db.user.find({"username": "zhangsan", "age": 22})                 查找 username=zhangsan 的数据，可以 ‘，’ 扩展查找多个
        db.user.findOne()                                                 查找第一条
        db.user.find({"username": /^mongo$/})                             模糊查询（正则匹配）
        db.user.find({"age": {$gt:22}})                                   查找 age>22 的数据
        db.user.find({"age": {$gte:22}})                                  查找 age>=22 的数据
        db.user.find({"age": {$lt:22}})                                   查找 age<22 的数据
        db.user.find({"age": {$lte:22}})                                  查找 age<=22 的数据
        db.user.find({"age": {$gte:23,$lte:26}})                          查找 age>=23 & age<=26 的数据
        db.user.find({$or:[{"age":26},{"age":23}]})                       查找 age=23 或 age=26 的数据，[注意]：$or 可使用在增删改查
        db.user.find({}, {name: 1})                                       指定只查找 name 这一属性（列），[缺点]：不够强大，后面有管道操作 $project
        db.user.find({"age": {$gt:22}}, {age: 1})                         指定只查找 age>22 的 age 这一属性（列）
        db.user.find({"age": {$gt:22}}, {name: 1, age: 1})                指定只查找 age>22 的 name, age 这些属性（列）
        db.user.find().sort({"age": 1})                                   1：升序查找，-1：降序查找
        db.user.find().limit(5)                                           查询前 5 条
        db.user.find().skip(5).limit(2)                                   跳过前 5 条开始查询接下来的 2 条，分页算法

        for(var i=1;i<100;i++) {                                          回车
        ...                                                               创建 99 条数据
        ... db.admin.insert({"username": "zhangsan"+i, "age": i})
        ... };                                                            闭合 for   

        db.admin.find().count()                                           统计 

  db.user.update                                                          更新数据
        db.user.update({"user":"zhangsan", "age": 22},{$set:{"user":"lisi", "gender": 1}})        
                                                                          查找 zhangsan 并更新成 lisi，[注意]：$set 只更新当前属性，没写会覆盖整条数据！默认只修改一条数据
        db.user.update({"user":"zhangsan"},{$set:{"user":"lisi"}},{multi: true})   
                                                                          更新多条
                          
  db.user.remove({"user":"zhangsan"})                                     删除数据
        db.user.remove({"age":{$gt:10}})                                  删除数据，条件任意
        db.user.remove({"user":"zhangsan"},{justOne: true})               删除 1 条

  

5.索引基础                                                                 mongodb 的索引几乎与传统的关系型数据库一样。
  db.user.find().explain("executionStats")                                查询具体的执行时间，[注意]：当字段带索引时，信息会包含命中索引字段 indexBounds
  db.user.getIndexes()                                                    查看当前表的索引
  db.user.ensureIndex({"username":1})                                     给 username 字段设置索引，提高查找 username 相关数据的速度
  db.user.ensureIndex({"username":1,"age":1})                             复合索引，只在查询 username & age 或者 username 时有效，[注意]：查询 age 索引无效，getIndexes() 查看差异
  db.user.ensureIndex({"username":1},{"unique":true})                     该字段唯一索引，当 insert({"username": [该username字段已存在的值]}) 时将报错，[注意]：设置前先删除索引
  db.user.dropIndex({"username":1})                                       删除索引，[注意]：先进行 getIndexes() 查看索引设置的值

6.账户权限配置
  mongo -> use admin -> show users                                        切换 db admin，查看 admin 下的管理账户
  mongo -> use admin -> show users -> db.dropUser('admin')                删除该 db 下名称为 admin 的账户
  mongo -> use admin -> show users -> db.updateUser('admin',{pwd:"934567"})    

  use admin -> db.createUser({user:'admin',pwd:'123456',roles:[{role:'root',db:'admin'}]})
                                                                          添加管理员，[注意] root 为最高权限，可以访问所有数据库 

  security:                                                               bin 目录下找到 mongod.cfg 文件修改 security
    authorization:enabled                                                 [注意]：备份 cfg 文件，然后将 security 前面的 ‘#’ 去掉，最后重启服务（cmd -> services.msc）
  
  mongo [admin_or_other_db] -u admin -p 123456                            登录验证，admin_or_other_db 假如为 admin 则能访问所有数据库，假如为 other db，则只能访问当前数据库
  mongo 192.168.0.1:27017/test -u admin -p 123456                         登录验证
  mongo admin -> db.auth("admin","123456")                                另一种登录验证

  use [no_db_admin] -> db.createUser({user:'waiter',pwd:'123456',roles:[{role:'dbOwner',db:'no_db_admin'}]})
                                                                          添加当前数据库的管理员，仅可以访问当前数据库 

7.关系型数据库表之间的关系
  1对1                                                                    身份证_表、驾照_表
  1对n                                                                    商品分类、商品列表，新闻分类、新闻列表，订单、商品列表
  n对n                                                                    有一张中间表用来存储索引溯源

8.聚合管道                                                                 对文档进行变换和组合，项目中一般用于表的关联查询及数据统计，管道串行执行   
  $project                                                                增加、删除、重命名字段，只显示指定的列
  $match                                                                  匹配进入下一阶段
  $limit
  $sum
  $skip
  $sort
  $group                                                                  条件组合结果，对数据进行分组
  $lookup                                                                 用以引入其他表集合的数据，即表关联

  db.order.aggregate([
    {$match:{status:'A'}},
    {$group:{_id:"$cust_id",total:{$sum:"$amount"}}}
  ])                                                                      匹配所有[status:A]的数据，然后根据 cust_id 的值分组[默认key为_id]；同时统计分组后的 amount 数据，key 为 total

  db.order.aggregate([
    {$project:{trade_no:1,all_price:1}},
    {$sort:{"all_price":-1}}
  ])                                                                      只显示 trade_no & all_price 两列数据，并以 all_price 降序  

  db.order.aggregate([
    {
      $lookup:{
        from:"order_item",
        localField:"order_id",
        foreignField:"order_id",
        as:"items"
      }
    },
  ])                                                                      order 表关联 order_item 表，关联属性为 order_id[恰好重名]，最后关联表数据用 items 数组表示           


  # cookie 客户端同域
    保存用户信息
    浏览器历史记录
    猜你喜欢
    10 天免登录
    多个页面数据传递
    购物车

    httpOnly                                                              是否只是服务器可以访问 cookie，默认为 true
    ctx.cookie.set(key, value, [options])
    ctx.cookie.get(key)
    secure                                                                默认为 false，设置成 true 表示只有 https 可以访问
    domain                                                                默认当前域名，当配置二级域名时可能需要，请 google
    new Buffer('中文').toString('base64')                                  中文 cookie 转成 base64
    new Buffer('中文','base64').toString()                                 解析 中文

  # session 同域，key:value 保存在服务器，将 key 作为值返回以 cookie 形式保存在客户端作为凭证
    ctx.session.role = 'admin'
    console.log(ctx.session.role)

  # 教程须知及整体内容

    本教程从零开始一步一步让你学会Koa基础、以及用Koa开发项目。本教程涉及Koa基础、自己用Koa封装DB库、 用户权限判断 、验证码 、分页、多级分类、ueditor可视化富文本编辑器、图片上传、底层DB库封装、扩展art-template的核心方法、ajax改变状态、ajax排序、、前后端分离 RESTful API Api接口、JWT接口权限验证、购买域名 服务器、域名备案、nginx负载均衡、域名解析部署nodejs程序、Nodejs进程管理器pm2模块、Koa操作mysql数据库。【赠送】Socket.io机器人 、Socket.io多人聊天室、Socket.io群聊、【送Mongodb进阶+Mongoose教程】Mongoose的安装、mongoose增删改查、mongoose默认参数 、mongoose模块化、Mongoose 预定义模式修饰符、自定义修饰符、Mongoose索引、扩展Mongoose内置查询方法、Mongoose 数据校验、Mongoose两个表关联查询aggregate、Mongoose N个表关联查询aggregate、Mongoose、 DBRef  Populate。

    知识体系图片：https://www.itying.com/goods-800.html