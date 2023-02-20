const express = require('express')
const router = express.Router()
const trendCommentKudosCtrl = require('../controller/trendCommentKudos')
const auth = require('../middleware/auth')


//评论点赞
router.post('/kudos', auth, trendCommentKudosCtrl.kudos)



module.exports = router