// 导入 mongodb的客户端
const MongoClient = require('mongodb').MongoClient
// connection url
const url = 'mongodb://localhost:27017'
// Database Name
const dbName = 'one'
// 这个模块是承上启下的,暴露给控制器的方法应该是通用的
//暴露的是通用的插入一条文档的方法
/*
参数1  要操作的集合
参数2  要插入的数据
参数3  回调函数  通过回调函数把操作数据库的结果(成功或者失败)传递给调用它的控制器
*/
exports.insertOne = (collectionName,params,callback)=>{
    MongoClient.connect(url,{useNewUrlParser:true},function(err,client) {
            const db = client.db(dbName)
            // 获取集合进行操作
            const collection = db.collection(collectionName)
            // 插入一条数据
            collection.insertOne(params,(err,doc)=>{
                client.close()
               //调用回调函数 把结果告知控制器
               callback(err,doc)
            })
        })
}
// 在数据库查询一个数据的通用方法
exports.findOne = (collectionName,params,callback) => {
    MongoClient.connect(url,{useNewUrlParser:true},function(err,client) {
        const db = client.db(dbName)
        // 获取集合进行操作
        const collection = db.collection(collectionName)
        // 调用数据库查询一个的方法
        collection.findOne(params,(err,doc)=>{
            client.close()
           //调用回调函数 把结果告知控制器
           callback(err,doc)
        })
    })
}
// 查询满足多条文档的方法
exports.findList = (collectionName,params,callback) => {
    MongoClient.connect(url,{useNewUrlParser:true},function(err,client) {
        const db = client.db(dbName)
        // 获取集合进行操作
        const collection = db.collection(collectionName)
        // 调用数据库带条件的查询多个文档的方法
        collection.find(params).toArray((err,docs)=>{
            client.close()
            //通过回调 把结果传给调用它的控制器
            callback(err,docs)
        })
    })
}