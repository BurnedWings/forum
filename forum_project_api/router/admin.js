const express = require('express')
const router = express.Router()
const adminCtrl = require('../controller/admin')
const refAdminToken = require('../middleware/refAdminToken')
const adminAuth = require('../middleware/adminAuth')

//添加文章类型
router.post('/createArticleType', adminCtrl.createArticleType)

//查询所有管理员信息
router.get('/getOtherAdmin', adminCtrl.getOtherAdmin)

//添加管理员
router.post('/createAdmin', adminCtrl.createAdmin)

//更新管理员
router.post('/updateTheAdmin', adminCtrl.updateTheAdmin)

//设置管理员头像
router.post('/setAdminImage', adminCtrl.setAdminImage)

//获取管理员信息
router.get('/getAdminInfo',adminAuth, adminCtrl.getAdminInfo)

//管理员登录
router.post('/adminLogin', adminCtrl.adminLogin)

//获取用户性别
router.get('/getUserGenderInfo', adminCtrl.getUserGenderInfo)

//获取文章类型分布
router.get('/getTypeArticleCount', adminCtrl.getTypeArticleCount)

//获取文章类型分布
router.post('/updateTheArticleType', adminCtrl.updateTheArticleType)

//获取七天内评论数
router.get('/commentCountForWek', adminCtrl.commentCountForWek)

//刷新token
router.put('/refAdminToken',refAdminToken, adminCtrl.refAdminToken)

//获取用户信息列表
router.post('/getUserInfoList', adminCtrl.getUserInfoList)

//禁言用户
router.post('/forbidTheUser', adminCtrl.forbidTheUser)

//禁言全部用户
router.get('/forbidAllUser', adminCtrl.forbidAllUser)

//解除禁言
router.post('/cancelForbidTheUser', adminCtrl.cancelForbidTheUser)

//解除禁言
router.get('/cancelForbidAllUser', adminCtrl.cancelForbidAllUser)

//处理公告图片
router.post('/handleNoticeImg', adminCtrl.handleNoticeImg)

//创建公告
router.post('/createNotice', adminCtrl.createNotice)

//获取未审核文章
router.post('/getNotAuditArticle', adminCtrl.getNotAuditArticle)

//通过审核
router.post('/auditTheArticle', adminCtrl.auditTheArticle)

//文章状态修改通知
router.post('/articleStatusMessage', adminCtrl.articleStatusMessage)

//获取已审核文章
router.post('/getAuditArticle', adminCtrl.getAuditArticle)

//退回文章
router.post('/backTheArticle', adminCtrl.backTheArticle)

//查询已退回文章
router.post('/getBackArticle', adminCtrl.getBackArticle)

//生成违规类型
router.post('/createReportType', adminCtrl.createReportType)

//获取举报文章信息
router.post('/getArticleReportMessage', adminCtrl.getArticleReportMessage)

//获取单独文章信息
router.get('/getCurrentArticle/:articleId', adminCtrl.getCurrentArticle)

//完成文章举报任务
router.post('/finishArticleReport', adminCtrl.finishArticleReport)

//获取文章评论举报信息
router.post('/getArticleCommentReport', adminCtrl.getArticleCommentReport)

//举报成功任务通知
router.post('/reportCommentSuccessMessage', adminCtrl.reportCommentSuccessMessage)

//完成文章评论举报任务
router.post('/finishTheArticleCommentTask', adminCtrl.finishTheArticleCommentTask)

//删除评论
router.post('/deleteReportComment', adminCtrl.deleteReportComment)

//删除回复
router.post('/deleteReportReply', adminCtrl.deleteReportReply)

//获取待审核动态
router.post('/getNotAuditTrend', adminCtrl.getNotAuditTrend)

//通过动态审核
router.post('/auditTheTrend', adminCtrl.auditTheTrend)

//锁定动态
router.post('/lockTheTrend', adminCtrl.lockTheTrend)

//获取已过审动态
router.post('/getAuditTrend', adminCtrl.getAuditTrend)

//获取动态举报信息
router.post('/getTrendReportMessage', adminCtrl.getTrendReportMessage)

//获取单条动态详情
router.post('/getCurrentTrend', adminCtrl.getCurrentTrend)

//完成动态举报任务
router.post('/finishTrendReportTask', adminCtrl.finishTrendReportTask)

//获取动态评论举报信息
router.post('/getTrendCommentReportMessage', adminCtrl.getTrendCommentReportMessage)

//完成动态评论举报任务
router.post('/finishTrendCommentReport', adminCtrl.finishTrendCommentReport)

//删除动态评论
router.post('/deleteTrendComment', adminCtrl.deleteTrendComment)

//删除动态回复
router.post('/deleteTrendReply', adminCtrl.deleteTrendReply)

//删除动态回复
router.post('/uploadSwiper', adminCtrl.uploadSwiper)

//查询轮播图
router.get('/getSwiper', adminCtrl.getSwiper)

//添加轮播图描述
router.post('/updateSwiperDescription', adminCtrl.updateSwiperDescription)

//删除轮播图
router.post('/removeSwiper', adminCtrl.removeSwiper)

//获取未推荐文章
router.post('/getNotRecommendArticle', adminCtrl.getNotRecommendArticle)

//推荐文章
router.post('/recommendTheArticle', adminCtrl.recommendTheArticle)

//获取推荐文章
router.post('/getRecommendArticle', adminCtrl.getRecommendArticle)

//取消推荐
router.post('/cancelArticleRecommend', adminCtrl.cancelArticleRecommend)

//大屏年龄分布
router.get('/getAgeInfo', adminCtrl.getAgeInfo)

//七日新增用户
router.get('/newUserWeek', adminCtrl.newUserWeek)

//待完成任务
router.get('/notFinishTask', adminCtrl.notFinishTask)

//获取单个用户
router.get('/getOneUserInfo/:userId', adminCtrl.getOneUserInfo)

//生成用户
router.post('/produceUser', adminCtrl.produceUser)

//更新用户生日
router.post('/updateUserBri', adminCtrl.updateUserBri)

//更新用户生日
router.post('/createBirthday', adminCtrl.createBirthday)

module.exports = router