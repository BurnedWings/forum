const express = require('express')
const router = express.Router()
const userCollectionCtrl = require('../controller/userCollection')
const auth = require('../middleware/auth')

//创建用户收藏夹表
router.post('/createUserCollection', userCollectionCtrl.createUserCollectionTable)



module.exports = router