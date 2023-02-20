const express = require('express')
const path = require('path')
const morgan = require('morgan')
const router = require('./router/index')
const errorHandler = require('./middleware/errorHandler')
const schedule = require('./util/schedule')
// const cors = require('cors')
require('./model')
const app = express()
const port = 3000

// app.use(cors())

//配置req.body
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/uploads',express.static(path.join(__dirname,'./public/uploads/')))
app.use('/avatars',express.static(path.join(__dirname,'./public/avatars/')))
app.use('/covers',express.static(path.join(__dirname,'./public/covers/')))
app.use('/trends',express.static(path.join(__dirname,'./public/trends/')))
app.use('/notices',express.static(path.join(__dirname,'./public/notices/')))
app.use('/swipers',express.static(path.join(__dirname,'./public/swipers/')))

//日志输出
app.use(morgan('dev'))

//挂载路由
app.use(router)

//挂载错误处理中间件
app.use(errorHandler())


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// schedule.sendBirthdayEmail()
// schedule.clearForbid()
// schedule.clearOverdueArticle()
// schedule.clearOverdueTrend()