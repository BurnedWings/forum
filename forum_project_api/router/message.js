const express = require('express')
const router = express.Router()
const messageCtrl = require('../controller/message')
const auth = require('../middleware/auth')

//获取回复
router.get('/getReply', auth, messageCtrl.getReply)

//获取点赞消息
router.get('/getKudos', auth, messageCtrl.getKudos)

//获取文章评论消息
router.get('/getArticleComment', auth, messageCtrl.getArticleComment)

//获取动态评论消息
router.get('/getTrendComment', auth, messageCtrl.getTrendComment)

//获取系统消息
router.get('/getSystemMessage', auth, messageCtrl.getSystemMessage)

//获取所有未读消息数量
router.get('/getAllNotCheckedMes', auth, messageCtrl.getAllNotCheckedMes)

//修改未读回复状态
router.get('/changeUnCheckedReply', auth, messageCtrl.changeUnCheckedReply)

//修改未读点赞状态
router.get('/changeUnCheckedKudos', auth, messageCtrl.changeUnCheckedKudos)

//修改未读文章评论状态
router.get('/changeUnCheckedArticleComment', auth, messageCtrl.changeUnCheckedArticleComment)

//修改未读动态评论状态
router.get('/changeUnCheckedTrendComment', auth, messageCtrl.changeUnCheckedTrendComment)

//获取公告详情
router.get('/getDetailNotice/:noticeId', auth, messageCtrl.getDetailNotice)

module.exports = router