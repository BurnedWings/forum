const express = require('express')
const router = express.Router()
const replyCtrl = require('../controller/reply')
const auth = require('../middleware/auth')



//创建回复
router.post('/createReply',auth, replyCtrl.createReply)

//创建回复
router.post('/deleteReply',auth, replyCtrl.deleteReply)


module.exports = router