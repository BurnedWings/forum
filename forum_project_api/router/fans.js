const express = require('express')
const router = express.Router()
const fansCtrl = require('../controller/fans')
const auth = require('../middleware/auth')


//关注
router.post('/concernOneUser',auth, fansCtrl.concernOneUser)

//取消关注
router.post('/cancelConcern',auth, fansCtrl.cancelConcern)

//获取关注状态
router.post('/getConcernStatus',auth, fansCtrl.getConcernStatus)

//获取关注列表
router.post('/getConcernList', fansCtrl.getConcernList)

//获取粉丝列表
router.post('/getFansList', fansCtrl.getFansList)





module.exports = router