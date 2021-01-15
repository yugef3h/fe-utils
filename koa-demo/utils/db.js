var MongoClient = require("mongodb").MongoClient;
var ObjectID = require("mongodb").ObjectID;
var Config = require("./config");


class Db {
  static getInstance() { // 单例解决不同实例的多次连接，实现实例共享，只有一个实例，使性能提高
    if (!Db.intance) {
      Db.intance = new Db()
    }
    return Db.intance
  }

  constructor() {
    this.dbClient = ''
    this.connect() // 默认连接
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (!this.dbClient) { // 解决同实例的数据库多次连接问题，使性能提高
        MongoClient.connect(Config.dbUrl, (err, client) => {
          if (err) {
            reject(err)
          } else {
            this.dbClient = client.db(Config.dbName)
            resolve(this.dbClient)
          }
        })
      } {
        resolve(this.dbClient)
      }
    })
  }

  find(cName, json) {
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        var result = db.collection(cName).find(json)
        result.toArray((err, docs) => {
          if (err) {
            reject(err)
            return;
          } 
          resolve(docs)
        })
      })
    })
  }

  update(cName, json1, json2) { 
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(cName).updateOne(json1, {
          $set: json2
        }, (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    })
  }

  insert(cName, json) { 
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(cName).insertOne(json, (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    })
  }

  remove(cName, json) { 
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        db.collection(cName).removeOne(json, (err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      })
    })
  }
  // 获取列表 _id 字段，用来查询：把字符串转成对象，mongodb _id 索引的特殊性
  // 查询 json        {"_id": Db.getId(id)}
  getId (id) { 
    return new ObjectID(id)
  }
}

module.exports = Db.getInstance()