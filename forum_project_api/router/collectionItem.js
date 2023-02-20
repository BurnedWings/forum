const express = require('express')
const router = express.Router()
const collectionItemCtrl = require('../controller/collectionItem')
const auth = require('../middleware/auth')

//创建收藏夹
router.post('/collection', auth, collectionItemCtrl.collection)

//创建收藏夹
router.post('/cancelCollection', auth, collectionItemCtrl.cancelCollection)



module.exports = router