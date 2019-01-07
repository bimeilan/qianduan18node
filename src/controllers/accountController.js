const path = require('path')
// 引入生成图片验证码的包
const captchapng = require('captchapng')
// 导入 mongodb的客户端
const MongoClient = require('mongodb').MongoClient
// connection url
const url = 'mongodb://localhost:27017'
// Database Name
const dbName = 'one'
// 暴露一个获取登录页面的方法给路由调用   对象
exports.getLoginPage = (req,res)=>{
    res.sendFile(path.join(__dirname,'../views/login.html'))
}
// 暴露获取图片验证码的方法  是对象
exports.getImageVcode = (req,res)=>{
    // 1 利用一个第三方包生成一张带数字的图片
    const random = parseInt(Math.random()*9000+1000)
    // 把随机图片上的数字存起来  存贮到session中
    req.session.vcode = random
    var p = new captchapng(80,30,random); // width,height,numeric captcha
    p.color(0, 255, 0, 255);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.writeHead(200, {
        'Content-Type': 'image/png'
    });
    res.end(imgbase64);
    // 2 存起来
    // 3 返回  并且告知是一张图片
}

// 暴露注册页面
exports.getRegisterPage = (req,res)=>{
    res.sendFile(path.join(__dirname,'../views/register.html'))
}
// 暴露出去注册的方法   status:0代表成功  status:1代表用户名失败 status:2代表注册失败
exports.register = (req,res)=>{
    const result = {status:0,message:"注册成功"}
    // 1获取传递过来的username  password
    //const params = req.body
    const {username,password} = req.body  //直接拿到两个属性的属性值对象  es6的解构赋值
    MongoClient.connect(url,{useNewUrlParser:true},function(err,client) {
        const db = client.db(dbName)
        // 获取集合进行操作
        const collection = db.collection('accountInfo')
        // 先根据用户名查询该用户是否存在
        collection.findOne({username},(err,doc)=>{
            console.log(doc)
            // 如果不存在 没找到  就返回null
            if(doc != null) {
                result.status = 1
                result.message = "用户名已经存在"
                client.close()
                res.json(result)
            }else { //用户名不存在的情况
                // req.body={username:"admin",password:123}
                collection.insertOne(req.body,(err,result1)=>{
                    //判断插入结果是否失败 如果失败就是null
                    if(result1 == null) { //如果等于null 代表注册失败
                        result.status = 2
                        result.message = "注册失败"
                    }
                    client.close()
                    //如果不等于null 代表注册成功
                    res.json(result)
                })
            }
        })
       
    })
    // 2 判断用户名是否存在 存在就响应用户说已经存在  不存在就先插入到数据库中 然后响应注册成功
    // 2.1 链接到mongo数据库  
}

//暴露登录方法  用户点击登录  status:0 成功   status:1验证码错误  status:2 用户名或密码错误
exports.login = (req,res)=>{
    const result = {status:0,message:"登录成功"}
    // 1 获取到请求体中的内容
    const {username,password,vcode} = req.body
    //2 验证验证码
    if(vcode != req.session.vcode) {
        result.status = 1
        result.message = "验证码错误!"
        res.json(result)
        return
    }
    //3 验证用户名和密码
    MongoClient.connect(url,{useNewUrlParser:true},function (err,client){
        const db = client.db(dbName)
        // 获取集合进行操作
        const collection = db.collection('accountInfo')
        collection.findOne({username,password},(err,doc)=>{
            if(doc == null) { //没查询到  用户名或密码错误
               result.status = 2
               result.message = "用户名或密码错误"             
            }
            client.close()
            res.json(result)
        })
    })
    
}