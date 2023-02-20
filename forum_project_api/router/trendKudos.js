const express = require('express')
const router = express.Router()
const trendKudosCtrl = require('../controller/trendKudos ')
const auth = require('../middleware/auth')


//点赞
router.post('/createTrendKudos',auth, trendKudosCtrl.kudos)

//获取点赞状态
router.post('/getTrendKudosStatus',auth, trendKudosCtrl.getKudosStatus)




module.exports = router