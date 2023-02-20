const express = require('express')
const router = express.Router()
const articleCtrl = require('../controller/article')
const auth = require('../middleware/auth')

//创建文章
router.post('/', auth, articleCtrl.createArticle)

//获取文章列表
router.post('/getArticleList', articleCtrl.getArticleList)

//获取文章详情
router.post('/getDetailArticle', articleCtrl.getDetailArticle)

//获取文章详情
router.post('/getToEditDetailArticle', articleCtrl.getToEditDetailArticle)

//获取文章详情
router.post('/getNotAuditArticle', articleCtrl.getNotAuditArticle)

//获取指定用户文章
router.get('/:userId', articleCtrl.getArticlesOfOneUser)

//获取指定用户待过审文章
router.get('/getNotAuditAndBackArticle/:userId', articleCtrl.getNotAuditAndBackArticle)

//文章图片处理
router.post('/handleImg', auth, articleCtrl.handleImg)

//文章封面处理
router.post('/handleCover', auth, articleCtrl.handleCover)

//搜索文章
router.post('/searchArticle', articleCtrl.searchArticle)

//更新文章
router.post('/updateArticle',auth,articleCtrl.updateArticle)

//删除文章
router.post('/deleteOneArticle',auth,articleCtrl.deleteOneArticle)

//获取文章类型
router.post('/getArticleType',articleCtrl.getArticleType)


module.exports = router