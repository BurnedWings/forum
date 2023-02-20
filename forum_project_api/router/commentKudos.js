const express = require('express')
const router = express.Router()
const commentKudosCtrl = require('../controller/commentKudos')
const auth = require('../middleware/auth')


//评论点赞
router.post('/kudos', auth, commentKudosCtrl.kudos)



module.exports = router