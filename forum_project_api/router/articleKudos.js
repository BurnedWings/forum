const express = require('express')
const router = express.Router()
const articleKudosCtrl = require('../controller/articleKudos')
const auth = require('../middleware/auth')


//点赞
router.post('/createArticleKudos',auth, articleKudosCtrl.kudos)

//获取点赞状态
router.post('/getArticleKudosStatus',auth, articleKudosCtrl.getKudosStatus)




module.exports = router