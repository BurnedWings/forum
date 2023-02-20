const { ReportType, Forbid, ArticleMessage, Notice, ArticleType, Admin, User, Article, Comment, Reply, TrendComment, TrendReply, ArticleReport, CommentReport, TrendReport, TrendCommentReport } = require('../model')
const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const formidable = require('formidable')
const config = require('../config/config.default')
const createJwt = require('../util/createJwt')
const md5 = require('../util/md5')

//获取违规类型
exports.getReportType = async (req, res, next) => {
    try {

        const typeList = await ReportType.find().select('content')

        res.status(200).json({
            code: 200,
            message: 'success',
            typeList
        })
    } catch (error) {
        next(error)
    }
}

//举报文章
exports.reportTheArticle = async (req, res, next) => {
    try {

        const report = req.body.report

        report.user = req.user._id

        const articleReport = new ArticleReport(report)

        await articleReport.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//举报评论
exports.reportTheComment = async (req, res, next) => {
    try {

        const commentReport = req.body.commentReport

        const commentId = commentReport.comment

        const replyId = commentReport.reply

        let ret = null

        if (commentId) {
            ret = await Comment.findById(commentId)
        }

        if (replyId) {
            ret = await Reply.findById(replyId)
        }

        if (ret) {
            commentReport.user = req.user._id

            const report = new CommentReport(commentReport)

            await report.save()
        }

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//举报动态
exports.reportTheTrend = async (req, res, next) => {
    try {

        const reportMessage = req.body.reportMessage
        reportMessage.user = req.user._id

        const report = new TrendReport(reportMessage)
        await report.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//举报动态评论
exports.reportTheTrendComment = async (req, res, next) => {
    try {

        const reportMessage = req.body.reportMessage

        const commentId = reportMessage.comment

        const replyId = reportMessage.reply

        let ret = null

        if (commentId) {
            ret = await TrendComment.findById(commentId)
        }

        if (replyId) {
            ret = await TrendReply.findById(replyId)
        }

        if (ret) {
            reportMessage.user = req.user._id

            const report = new TrendCommentReport(reportMessage)

            await report.save()
        }


        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}


