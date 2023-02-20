const express = require('express')
const router = express.Router()



//用户登录
router.get('/users/login',(req,res)=>{
    res.send('success')
})

module.exports=router