const express = require('express')
const router = express.Router()
const commentCtrl = require('../controller/comments')
const auth = require('../middleware/auth')


//创建评论
router.post('/createComment',auth, commentCtrl.createComment)

//删除评论
router.post('/deleteComment',auth, commentCtrl.deleteComment)

//查询文章评论
router.post('/getComments',commentCtrl.getComments)

//查询文章评论(date)
router.post('/getCommentsByDate',commentCtrl.getCommentsByDate)




module.exports = router