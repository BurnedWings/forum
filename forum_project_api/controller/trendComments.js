const { User, Comment, TrendComment, TrendCommentKudos, TrendKudos, Trend, TrendReply, TrendReplyKudos } = require('../model')
const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')

//创建评论
exports.createComment = async (req, res, next) => {
    try {

        const trendComment = new TrendComment(req.body.trendComment)
        await trendComment.save()

        const trend = await Trend.findById(trendComment.trend)

        const myTrendsCount = trend.commentsCount + 1

        await Trend.findByIdAndUpdate(trend._id, {
            $set: {
                commentsCount: myTrendsCount
            }
        })

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//获取评论列表
exports.getComments = async (req, res, next) => {
    try {
        const trendId = req.body.trendId
        const comments = await TrendComment.find({
            trend: trendId
        })
            .populate({
                path: 'replyList',
                populate: {
                    path: 'toReply'
                }
            })
            .populate(
                {
                    path: 'user',
                    select: '_id username image '
                },
            ).populate(
                {
                    path: 'replyList',
                    populate: {
                        path: 'user',
                        select: '_id username image '
                    }
                }
            ).sort({
                favoritesCount: 'desc'
            })
        let totalNum = 0
        for (const i in comments) {
            totalNum = totalNum + (comments[i].replyList.length)
        }
        totalNum += comments.length


        if (comments.length === 0) {
            return res.status(200).json({
                code: 200,
                message: 'success',
                totalNum
            })
        }

        //获取评论点赞状态

        let status = []
        let token = req.headers.authorization
        if (token) {
            try {
                const decodedToken = await verify(token, jwtSecret)
                const user = await User.findById(decodedToken.userId)
                if (user) {
                    for (const j in comments) {
                        const ret = await TrendCommentKudos.findOne({
                            user: user._id,
                            trendComment: comments[j]._id,
                            ofUser: comments[j].user._id
                        }).then((ret) => {
                            if (ret) {
                                status.push({
                                    status: 1,
                                    reply: []
                                })
                            } else {
                                status.push({
                                    status: 0,
                                    reply: []
                                })
                            }
                        })
                        const replyList = comments[j].replyList
                        if (replyList[0]) {
                            for (const i in replyList) {
                                await TrendReplyKudos.findOne({
                                    user: user._id,
                                    trendReply: replyList[i]._id,
                                    ofUser: replyList[i].user._id
                                })
                                    .then((res) => {
                                        if (status[j].reply) {
                                            if (res) {
                                                status[j].reply.push(1)
                                            } else {
                                                status[j].reply.push(0)
                                            }
                                        }
                                    })
                                if ((comments.length === parseInt(j) + 1) && (replyList.length === parseInt(i) + 1)) {
                                    res.status(200).json({
                                        code: 200,
                                        message: 'success',
                                        comments,
                                        totalNum,
                                        status
                                    })
                                }
                            }
                        } else {
                            if (comments.length === parseInt(j) + 1) {
                                res.status(200).json({
                                    code: 200,
                                    message: 'success',
                                    comments,
                                    totalNum,
                                    status
                                })
                            }
                        }
                    }
                }
            } catch (error) {
                return res.status(200).json({
                    code: 200,
                    message: 'success',
                    comments,
                    totalNum
                })
            }
        } else {
            res.status(200).json({
                code: 200,
                message: 'success',
                comments,
                totalNum
            })
        }
    } catch (error) {
        next(error)
    }
}

//获取评论列表(date)
exports.getCommentsByDate = async (req, res, next) => {
    try {
        const trendId = req.body.trendId
        const comments = await TrendComment.find({
            trend: trendId
        })
            .populate({
                path: 'replyList',
                populate: {
                    path: 'toReply'
                }
            })
            .populate(
                {
                    path: 'user',
                    select: '_id username image '
                },
            ).populate(
                {
                    path: 'replyList',
                    populate: {
                        path: 'user',
                        select: '_id username image '
                    }
                }
            ).sort({
                createdAt: 'desc'
            })
        let totalNum = 0
        for (const i in comments) {
            totalNum = totalNum + (comments[i].replyList.length)
        }
        totalNum += comments.length


        if (comments.length === 0) {
            return res.status(200).json({
                code: 200,
                message: 'success',
                totalNum
            })
        }

        //获取评论点赞状态

        let status = []
        let token = req.headers.authorization
        if (token) {
            try {
                const decodedToken = await verify(token, jwtSecret)
                const user = await User.findById(decodedToken.userId)
                if (user) {
                    for (const j in comments) {
                        const ret = await TrendCommentKudos.findOne({
                            user: user._id,
                            trendComment: comments[j]._id,
                            ofUser: comments[j].user._id
                        }).then((ret) => {
                            if (ret) {
                                status.push({
                                    status: 1,
                                    reply: []
                                })
                            } else {
                                status.push({
                                    status: 0,
                                    reply: []
                                })
                            }
                        })
                        const replyList = comments[j].replyList
                        if (replyList[0]) {
                            for (const i in replyList) {
                                await TrendReplyKudos.findOne({
                                    user: user._id,
                                    trendReply: replyList[i]._id,
                                    ofUser: replyList[i].user._id
                                })
                                    .then((res) => {
                                        if (status[j].reply) {
                                            if (res) {
                                                status[j].reply.push(1)
                                            } else {
                                                status[j].reply.push(0)
                                            }
                                        }
                                    })
                                if ((comments.length === parseInt(j) + 1) && (replyList.length === parseInt(i) + 1)) {
                                    res.status(200).json({
                                        code: 200,
                                        message: 'success',
                                        comments,
                                        totalNum,
                                        status
                                    })
                                }
                            }
                        } else {
                            if (comments.length === parseInt(j) + 1) {
                                res.status(200).json({
                                    code: 200,
                                    message: 'success',
                                    comments,
                                    totalNum,
                                    status
                                })
                            }
                        }
                    }
                }
            } catch (error) {
                return res.status(200).json({
                    code: 200,
                    message: 'success',
                    comments,
                    totalNum
                })
            }
        } else {
            res.status(200).json({
                code: 200,
                message: 'success',
                comments,
                totalNum
            })
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}


//删除评论
exports.deleteComment = async (req, res, next) => {
    try {
        const commentId = req.body.comment
        const trendId = req.body.trend

        await TrendComment.findByIdAndDelete(commentId)
        const trend = await Trend.findById(trendId)

        const replyCount = await TrendReply.count({
            trendComment: commentId
        })

        await TrendCommentKudos.deleteMany({
            trendComment: commentId
        })
        trend.commentsCount -= (replyCount + 1)
        await trend.save()

        if (replyCount != 0) {
            const replyList = await TrendReply.find({
                trendComment: commentId
            })
            for (const i in replyList) {
                const trendReply = replyList[i]._id
                await TrendReplyKudos.deleteMany({
                    trendReply
                })
                await replyList[i].remove()
                if (replyList.length === parseInt(i) + 1) {
                    return res.status(200).json({
                        code: 200,
                        message: 'success'
                    })
                }
            }
        }

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}