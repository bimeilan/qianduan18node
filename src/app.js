// 1 导入express
const express = require('express')
// 加载自己写的模块一定要使用path
const path = require('path')
// 导入处理post请求的中间件
const bodyParser = require('body-parser')
// 导入创建session开辟内存空间的中间件
const session = require('express-session')
// 2 创建app
const app = express()
// node中处理静态资源
app.use(express.static(path.join(__dirname,'statics')))
// 集成bodyParser中间件  复制粘贴
app.use(bodyParser.urlencoded({extended:false}))
// 设置bodyParser的格式  复制粘贴
app.use(bodyParser.json())
// 使用session中间件  60000是时间毫秒  1分钟
app.use(session({secret:'keyboard cat',resave:true,saveUninitialized:true,cookie:{maxAge:60000}}))
//导入集成路由中间件   要放在所有中间件的后面
const accountRouter = require(path.join(__dirname,'./routers/accountRouter.js'))
const studentManagerRouter = require(path.join(__dirname,'./routers/studentManagerRouter.js'))
app.use('/account',accountRouter)
app.use('/studentmanager',studentManagerRouter)
// 3 请求处理和响应
// app.get('/index',(req,res)=>{
//     res.send('hello')
// })
// 4 开启监听
app.listen(5000,'127.0.0.1',err=>{
    if(err) {
        console.log(err)
    }
    console.log('start ok')
})