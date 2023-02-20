const { Comment } = require('../model')
const { Article, CommentKudos, User, ReplyKudos, Reply } = require('../model')
const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')

//创建评论
exports.createComment = async (req, res, next) => {
    try {

        const comment = new Comment(req.body.comment)

        await comment.save()

        const article = await Article.findById(comment.article)
        const myCommentsCount = article.commentsCount + 1
        await Article.findByIdAndUpdate(article._id, {
            $set: {
                commentsCount: myCommentsCount
            }
        })

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取评论列表
exports.getComments = async (req, res, next) => {
    try {
        const articleId = req.body.articleId
        const comments = await Comment.find({
            article: articleId
        })
            .populate({
                path: 'replyList',
                populate: {
                    path: 'toReply'
                }
            })
            .populate(
                {
                    path: 'user'
                },
            ).populate(
                {
                    path: 'replyList',
                    populate: {
                        path: 'user'
                    }
                }
            )
            .sort({
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
                messageL: 'success',
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
                        const ret = await CommentKudos.findOne({
                            user: user._id,
                            comment: comments[j]._id,
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
                                await ReplyKudos.findOne({
                                    user: user._id,
                                    reply: replyList[i]._id,
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

//获取评论列表(date)
exports.getCommentsByDate = async (req, res, next) => {
    try {
        const articleId = req.body.articleId
        const comments = await Comment.find({
            article: articleId
        })
            .populate({
                path: 'replyList',
                populate: {
                    path: 'toReply'
                }
            })
            .populate(
                {
                    path: 'user'
                },
            ).populate(
                {
                    path: 'replyList',
                    populate: {
                        path: 'user'
                    }
                }
            )
            .sort({
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
                messageL: 'success',
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
                        const ret = await CommentKudos.findOne({
                            user: user._id,
                            comment: comments[j]._id,
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
                                await ReplyKudos.findOne({
                                    user: user._id,
                                    reply: replyList[i]._id,
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

//删除评论
exports.deleteComment = async (req, res, next) => {
    try {
        const commentId = req.body.comment
        const articleId = req.body.article

        await Comment.findByIdAndDelete(commentId)
        const article = await Article.findById(articleId)

        const replyCount = await Reply.count({
            comment: commentId
        })

        await CommentKudos.deleteMany({
            comment: commentId
        })
        article.commentsCount -= (replyCount + 1)
        await article.save()

        if (replyCount != 0) {
            const replyList = await Reply.find({
                comment: commentId
            })
            for (const i in replyList) {
                const reply = replyList[i]._id
                await ReplyKudos.deleteMany({
                    reply
                })
                await replyList[i].remove()
                // if (replyList.length === parseInt(i) + 1) {
                //     return res.status(200).json({
                //         code: 200,
                //         message: 'success'
                //     })
                // }
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

