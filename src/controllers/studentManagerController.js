const xtpl = require('xtpl')
const path = require('path')
//把封装的连接数据库工具导入
const databasetool = require(path.join(__dirname,'../tools/databasetool.js'))
const MongoClient = require('mongodb').MongoClient
// Connection URL
const url = 'mongodb://localhost:27017'
//Database Name
const dbName = 'one'
exports.getStudentListPage = (req,res)=>{
    // 1 获取到关键字的值   第一次没有带数据给个空字符串  当是空字符串的时候会查询所有 因为每个都有含空字符串
    const keyword = req.query.keyword || ""
    // 连接数据库  调用databasetool.js的方法
    databasetool.findList('studentInfo',{name:{$regex:keyword}},(err,docs)=>{
        xtpl.renderFile(path.join(__dirname,'../views/list.html'),{studentList:docs,keyword},(err,content)=>{
            res.send(content)
        })
    })
    // MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    //     //获取数据库操作的对象
    //     const db = client.db(dbName)
    //     // 拿到集合
    //     const collection = db.collection('studentInfo')
    //     collection.find({name:{$regex:keyword}}).toArray((err,docs)=>{
    //         client.close()
    //         xtpl.renderFile(path.join(__dirname,'../views/list.html'),{studentList:docs,keyword},(err,content)=>{
    //             res.send(content)
    //         })
    //     })
    // })  
}

//暴露用户点击新增按钮  渲染新增页面的方法
exports.getAddStudentPage = (req,res) => {
    xtpl.renderFile(path.join(__dirname,'../views/add.html'),{},(err,content)=>{
        res.send(content)
    })
}

//暴露点击新增后的保存方法
exports.addStudent = (req,res)=>{
    databasetool.insertOne('studentInfo',req.body,(err,result)=>{
        if(result == null) {
            res.send('<script>alert("插入失败")</script>')
        }else {
            res.send('<script>window.location.href = "/studentmanager/list"</script>')
        }
    })
}
//暴露点击编辑学生信息的页面
exports.getEditStudentPage = (req,res) => {
    const _id =databasetool.ObjectId(req.params.studentId)
    databasetool.findOne('studentInfo',{_id},(err,doc)=>{
      //console.log(doc)
      xtpl.renderFile(path.join(__dirname,'../views/edit.html'),{studentInfo:doc},(err,content)=>{
         res.send(content)
      })
    })

}

//暴露新增学生信息成功后点击修改的方法
exports.editStudent = (req,res) =>{
    // 获取传递过来的id
    const _id = databasetool.ObjectId(req.params.studentId)
    databasetool.updateOne('studentInfo',{_id},req.body,(err,result)=>{
        if(result == null) { //失败
            res.send('<script>alert("修改失败")</script>')
        }else {
            res.send('<script>window.location.href = "/studentmanager/list"</script>')
        }
    })
}