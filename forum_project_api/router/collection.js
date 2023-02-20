const express = require('express')
const router = express.Router()
const collectionCtrl = require('../controller/collection')
const auth = require('../middleware/auth')

//创建收藏夹
router.post('/createCollection', auth, collectionCtrl.createCollection)

//删除收藏夹
router.delete('/deleteCollection/:collectionId',auth,collectionCtrl.deleteCollection)

//获取收藏夹列表
router.post('/getCollectionList', auth, collectionCtrl.getCollectionList)

//获取单个收藏夹所有文章
router.post('/getArticle/:collectionId', auth, collectionCtrl.getArticle)

//修改收藏夹名称
router.post('/updateCollectionName', auth, collectionCtrl.updateCollectionName)

//获取收藏状态
router.get('/getCollectionStatus/:articleId', auth, collectionCtrl.getCollectionStatus)

//移动文章到指定文件夹
router.post('/removeArticleTo', auth, collectionCtrl.removeArticleTo)

//移除作者已删除文章
router.post('/removeArticleWitchDeleted', auth, collectionCtrl.removeArticleWitchDeleted)



module.exports = router