const express = require('express')
const router = express.Router()
const trendCtrl = require('../controller/trend')
const auth = require('../middleware/auth')

//获取关注作者文章
router.get('/getTrendArticle', auth, trendCtrl.getTrendArticle)

//发布动态
router.post('/createTrend',auth,trendCtrl.createTrend)

//处理动态图片
router.post('/handleTrendImg/:trendId',auth,trendCtrl.handleTrendImg)

//查询关注用户动态
router.get('/getConcernTrend',auth,trendCtrl.getConcernTrend)

//动态详情
router.get('/getDetailTrend/:trendId',trendCtrl.getDetailTrend)

//动态详情
router.get('/getOwnTrend/:userId',trendCtrl.getOnwTrend)

//删除动态
router.post('/deleteOwnTrend',auth,trendCtrl.deleteOwnTrend)


module.exports = router