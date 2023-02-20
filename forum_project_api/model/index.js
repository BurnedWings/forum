const mongoose = require('mongoose');
const {dbUrl} = require('../config/config.default')
mongoose.connect(dbUrl)

var db = mongoose.connection

db.on('err',(err)=>{
    console.log('数据库连接失败',err)
})

db.once('open',()=>{
    console.log('数据库连接成功')
})

//组织导出模型类
module.exports = {
    User:mongoose.model('User',require('./user')),
    Article:mongoose.model('Article',require('./article')),
    ArticleType:mongoose.model('ArticleType',require('./articleType')),
    Comment:mongoose.model('Comment',require('./comments')),
    Reply:mongoose.model('Reply',require('./reply')),
    ArticleKudos:mongoose.model('ArticleKudos',require('./articleKudos')),
    UserCollection:mongoose.model('UserCollection',require('./userCollection')),
    Collection:mongoose.model('Collection',require('./collection')),
    CollectionItem:mongoose.model('CollectionItem',require('./collectionItem')),
    CommentKudos:mongoose.model('CommentKudos',require('./commentKudos')),
    ReplyKudos:mongoose.model('ReplyKudos',require('./replyKudos')),
    Fans:mongoose.model('Fans',require('./fans')),
    Trend:mongoose.model('Trend',require('./trend')),
    TrendComment:mongoose.model('TrendComment',require('./trendComments')),
    TrendReply:mongoose.model('TrendReply',require('./trendReply')),
    TrendKudos:mongoose.model('TrendKudos',require('./trendKudos')),
    TrendCommentKudos:mongoose.model('TrendCommentKudos',require('./trendCommentKudos')),
    TrendReplyKudos:mongoose.model('TrendReplyKudos',require('./trendReplyKudos')),
    Captcha:mongoose.model('Captcha',require('./captcha')),
    Admin:mongoose.model('Admin',require('./admin')),
    Notice:mongoose.model('Notice',require('./notice')),
    NoticeChecked:mongoose.model('NoticeChecked',require('./noticeChecked')),
    ArticleMessage:mongoose.model('ArticleMessage',require('./articleMessage')),
    Forbid:mongoose.model('Forbid',require('./forbid')),
    ReportType:mongoose.model('ReportType',require('./reportType')),
    ArticleReport:mongoose.model('ArticleReport',require('./articleReport')),
    CommentReport:mongoose.model('CommentReport',require('./commentReport')),
    ReportCommentMessage:mongoose.model('ReportCommentMessage',require('./reportCommentMessage')),
    TrendReport:mongoose.model('TrendReport',require('./trendReport ')),
    TrendMessage:mongoose.model('TrendMessage',require('./trendMessage')),
    TrendCommentReport:mongoose.model('TrendCommentReport',require('./trendCommentReport')),
    TrendReportCommentMessage:mongoose.model('TrendReportCommentMessage',require('./trendReportCommentMessage')),
    Swiper:mongoose.model('Swiper',require('./swiper')),
    Email:mongoose.model('Email',require('./email')),
    Birthday:mongoose.model('Birthday',require('./birthday')),
    ArticleCollection:mongoose.model('ArticleCollection',require('./articleCollection')),
    ArticleCollectionItem:mongoose.model('ArticleCollectionItem',require('./articleCollectionItem')),
}
