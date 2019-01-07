const xtpl = require('xtpl')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
// Connection URL
const url = 'mongodb://localhost:27017'
//Database Name
const dbName = 'one'
exports.getStudentListPage = (req,res)=>{
    // 1 获取到关键字的值   第一次没有带数据给个空字符串  当是空字符串的时候会查询所有 因为每个都有含空字符串
    const keyword = req.query.keyword || ""
    // 连接数据库
    MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
        //获取数据库操作的对象
        const db = client.db(dbName)
        // 拿到集合
        const collection = db.collection('studentInfo')
        collection.find({name:{$regex:keyword}}).toArray((err,docs)=>{
            client.close()
            xtpl.renderFile(path.join(__dirname,'../views/list.html'),{studentList:docs,keyword},(err,content)=>{
                res.send(content)
            })
        })
    })  
}