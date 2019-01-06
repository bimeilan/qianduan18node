// 1 导入express
const express = require('express')
const path = require('path')
// 2 创建路由对象
const accountRouter = express.Router()
const accountCTRL = require(path.join(__dirname,'../controllers/accountController.js'))
accountRouter.get('/login',accountCTRL.getLoginPage)
// 导出路由模块
module.exports=accountRouter