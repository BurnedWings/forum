const express = require('express')
const router = express.Router()
const reportCtrl = require('../controller/report')
const auth = require('../middleware/auth')


//获取违规类型
router.get('/getReportType', reportCtrl.getReportType)

//举报文章
router.post('/reportTheArticle',auth, reportCtrl.reportTheArticle)

//举报评论
router.post('/reportTheComment',auth, reportCtrl.reportTheComment)

//举报动态
router.post('/reportTheTrend',auth, reportCtrl.reportTheTrend)

//举报动态评论
router.post('/reportTheTrendComment',auth, reportCtrl.reportTheTrendComment)



module.exports = router