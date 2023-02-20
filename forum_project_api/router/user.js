const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/user')
const auth = require('../middleware/auth')
const userValidator = require('../validator/user')
const refreshToken = require('../middleware/refreshToken')

//刷新token
router.put('/users/refreshToken', refreshToken, userCtrl.refreshToken)

router.get('/users/getAddress', userCtrl.getAddress)

//用户登录
router.post('/users/login', userValidator.login, userCtrl.login)

//用户登录
router.post('/users/emailLogin', userCtrl.emailLogin)

//用户注册
router.post('/users/register', userValidator.register, userCtrl.register)

//获取验证码
router.post('/users/sendCaptcha', userCtrl.sendCaptcha)

//获取当前登录用户信息
router.get('/user', auth, userCtrl.getCurrentUser)

//获取指定用户信息
router.get('/user/:userId', userCtrl.getOneUser)

//更新登录用户信息
router.post('/user', auth, userCtrl.updateUserInfo)

//设置用户头像
router.post('/user/avatar',auth,userCtrl.updateUserAvatar)

//查询轮播图
router.get('/users/getSwiper',userCtrl.getSwiper)

//轮播图点赞
router.post('/users/kudosTheSwiper',userCtrl.kudosTheSwiper)

//获取推荐文章
router.get('/users/getRecommendArticle',userCtrl.getRecommendArticle)

//更新密码
router.post('/users/updatePassword',auth, userCtrl.updatePassword)

//更新密码
router.post('/users/updatePasswordByEmail',auth, userCtrl.updatePasswordByEmail)

//发送验证码
router.get('/users/sendUpdatePasswordCaptcha',auth, userCtrl.sendUpdatePasswordCaptcha)

//添加邮箱
router.post('/users/addEmail',auth, userCtrl.addEmail)

//获取邮箱列表
router.get('/users/getEmailList',auth, userCtrl.getEmailList)

//更新备用邮箱
router.post('/users/updateSpareEmail',auth, userCtrl.updateSpareEmail)

//创建合集
router.post('/users/createTheArticleCollection',auth, userCtrl.createTheArticleCollection)

//获取合集
router.post('/users/getArticleCollection',auth, userCtrl.getArticleCollection)

//获取合集
router.post('/users/getOneArticleCollection',auth, userCtrl.getOneArticleCollection)

//获取合集
router.post('/users/getCollectionArticleList',auth, userCtrl.getCollectionArticleList)

//获取合集
router.post('/users/addArticleToCollection',auth, userCtrl.addArticleToCollection)

//获取合集
router.post('/users/deleteArticleOfCollection',auth, userCtrl.deleteArticleOfCollection)

//更新合集
router.post('/users/updateTheCollection',auth, userCtrl.updateTheCollection)

//删除合集
router.post('/users/deleteTheCollection',auth, userCtrl.deleteTheCollection)

//删除合集
router.post('/users/getArticleOfCollection', userCtrl.getArticleOfCollection)


module.exports = router