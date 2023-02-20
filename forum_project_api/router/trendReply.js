const express = require('express')
const router = express.Router()
const trendReplyCtrl = require('../controller/trendReply')
const auth = require('../middleware/auth')



//创建回复
router.post('/createReply',auth, trendReplyCtrl.createReply)

//删除回复
router.post('/deleteReply',auth, trendReplyCtrl.deleteReply)


module.exports = router