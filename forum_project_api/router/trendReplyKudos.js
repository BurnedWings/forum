const express = require('express')
const router = express.Router()
const trendReplyKudosCtrl = require('../controller/trendReplyKudos')
const auth = require('../middleware/auth')


//评论点赞
router.post('/kudos', auth, trendReplyKudosCtrl.kudos)



module.exports = router