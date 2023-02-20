const express = require('express')
const router = express.Router()
const trendCommentCtrl = require('../controller/trendComments')
const auth = require('../middleware/auth')


//创建评论
router.post('/createComment',auth, trendCommentCtrl.createComment)

//删除评论
router.post('/deleteComment',auth, trendCommentCtrl.deleteComment)

//查询文章评论
router.post('/getComments',trendCommentCtrl.getComments)

//查询文章评论(date)
router.post('/getCommentsByDate',trendCommentCtrl.getCommentsByDate)



module.exports = router