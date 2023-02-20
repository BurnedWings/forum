const express = require('express')
const router = express.Router()
const replyKudosCtrl = require('../controller/replyKudos')
const auth = require('../middleware/auth')


//评论点赞
router.post('/kudos', auth, replyKudosCtrl.kudos)



module.exports = router