const express = require('express')
const router = express.Router()

//用户相关路由
router.use(require('./user'))

// //文章相关路由
router.use('/articles',require('./article'))

// //标签相关路由
// router.use('/tag',require('./tag'))

// //用户资料相关路由
// router.use('/profiles',require('./profile'))

// 评论相关路由
router.use('/comments',require('./comments'))

// 回复相关路由
router.use('/replies',require('./reply'))

// 文章点赞相关路由
router.use('/articleKudos',require('./articleKudos'))

// 用户收藏夹表相关路由
router.use('/userCollections',require('./userCollection'))

// 用户收藏夹相关路由
router.use('/collections',require('./collection'))

// 用户收藏相关路由
router.use('/collectionItem',require('./collectionItem'))

// 用户收藏相关路由
router.use('/commentKudos',require('./commentKudos'))

// 用户收藏相关路由
router.use('/replyKudos',require('./replyKudos'))

// 用户关注相关路由
router.use('/fans',require('./fans'))

// 动态相关路由
router.use('/trend',require('./trend'))

// 动态点赞相关路由
router.use('/trendKudos',require('./trendKudos'))


// 动态评论相关路由
router.use('/trendComments',require('./trendComments'))

// 动态评论点赞相关路由
router.use('/trendCommentsKudos',require('./trendCommentKudos'))

// 动态回复相关路由
router.use('/trendReply',require('./trendReply'))

// 动态回复点赞相关路由
router.use('/trendReplyKudos',require('./trendReplyKudos'))

// 消息相关路由
router.use('/message',require('./message'))

// 后台相关路由
router.use('/admin',require('./admin'))

// 举报相关路由
router.use('/report',require('./report'))


module.exports=router