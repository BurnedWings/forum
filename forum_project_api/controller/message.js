const { Article, Comment, Reply, TrendComment, TrendReply, ReplyKudos, TrendReplyKudos, ArticleKudos, TrendKudos, CommentKudos, TrendCommentKudos, Trend, User, Notice, ArticleMessage, TrendMessage, ReportCommentMessage, TrendReportCommentMessage, NoticeChecked } = require('../model')

//查询回复
exports.getReply = async (req, res, next) => {
    try {

        const user = req.user._id

        const commentList = await Comment.find({
            user
        }).sort({
            createdAt: 'desc'
        })

        let replyArr = []
        let statusArr = []
        if (commentList.length > 0) {
            for (const i in commentList) {
                await Reply.find({
                    comment: commentList[i]._id,
                    toReply: null
                })
                    .populate({
                        path: 'user',
                        select: 'image username'
                    })
                    .populate({
                        path: 'comment',
                        select: 'body'
                    }).then(async (ret) => {
                        replyArr.push(...ret)
                        if (ret.length > 0) {
                            for (const retIndex in ret) {
                                await ReplyKudos.findOne({
                                    reply: ret[retIndex]._id,
                                    user
                                })
                                    .then(replyKudos => {
                                        if (replyKudos) {
                                            statusArr.push({
                                                createdAt: ret[retIndex].createdAt,
                                                status: 1
                                            })
                                        } else {
                                            statusArr.push({
                                                createdAt: ret[retIndex].createdAt,
                                                status: 0
                                            })
                                        }
                                    })
                                // if(ret.length===parseInt(retIndex)+1){
                                //     console.log(statusArr)
                                // }
                            }
                        }
                    })

                if (commentList.length === parseInt(i) + 1) {
                    let trendReplyArr = []

                    const trendCommentList = await TrendComment.find({
                        user
                    })
                    if (trendCommentList.length > 0) {
                        for (const j in trendCommentList) {
                            await TrendReply.find({
                                trendComment: trendCommentList[j]._id,
                                toReply: null
                            })
                                .populate({
                                    path: 'user',
                                    select: 'image username'
                                })
                                .populate({
                                    path: 'trendComment',
                                    select: 'body'
                                })
                                .populate({
                                    path: 'toReplyId',
                                    select: 'body'
                                })
                                .then(async (ret) => {
                                    trendReplyArr.push(...ret)
                                    if (ret.length > 0) {
                                        for (const retIndex in ret) {
                                            await TrendReplyKudos.findOne({
                                                trendReply: ret[retIndex]._id,
                                                user
                                            })
                                                .then(replyKudos => {
                                                    if (replyKudos) {
                                                        statusArr.push({
                                                            createdAt: ret[retIndex].createdAt,
                                                            status: 1
                                                        })
                                                    } else {
                                                        statusArr.push({
                                                            createdAt: ret[retIndex].createdAt,
                                                            status: 0
                                                        })
                                                    }
                                                })
                                        }
                                    }
                                })
                            if (trendCommentList.length === parseInt(j) + 1) {
                                let commentReplyArr = []
                                await Reply.find({
                                    toReply: user
                                })
                                    .populate({
                                        path: 'user',
                                        select: 'image username'
                                    })
                                    .populate({
                                        path: 'comment',
                                        select: 'body'
                                    })
                                    .populate({
                                        path: 'toReplyId',
                                        select: 'body'
                                    })
                                    .then(async (ret) => {
                                        commentReplyArr.push(...ret)
                                        if (ret.length > 0) {
                                            for (const replyIndex in ret) {
                                                await ReplyKudos.findOne({
                                                    reply: ret[replyIndex]._id,
                                                    user
                                                })
                                                    .then((newReplyKudos) => {
                                                        if (newReplyKudos) {
                                                            statusArr.push({
                                                                createdAt: ret[replyIndex].createdAt,
                                                                status: 1
                                                            })
                                                        } else {
                                                            statusArr.push({
                                                                createdAt: ret[replyIndex].createdAt,
                                                                status: 0
                                                            })
                                                        }
                                                    })
                                            }
                                        }
                                    })

                                let trendCommentReply = []
                                await TrendReply.find({
                                    toReply: user
                                })
                                    .populate({
                                        path: 'user',
                                        select: 'image username'
                                    })
                                    .populate({
                                        path: 'trendComment',
                                        select: 'body'
                                    })
                                    .populate({
                                        path: 'toReplyId',
                                        select: 'body'
                                    })
                                    .then(async (ret) => {
                                        trendCommentReply.push(...ret)
                                        if (ret.length > 0) {
                                            for (const replyIndex in ret) {
                                                await TrendReplyKudos.findOne({
                                                    trendReply: ret[replyIndex]._id,
                                                    user
                                                })
                                                    .then((newReplyKudos) => {
                                                        if (newReplyKudos) {
                                                            statusArr.push({
                                                                createdAt: ret[replyIndex].createdAt,
                                                                status: 1
                                                            })
                                                        } else {
                                                            statusArr.push({
                                                                createdAt: ret[replyIndex].createdAt,
                                                                status: 0
                                                            })
                                                        }
                                                    })
                                            }
                                        }

                                    })

                                let retArr = [...replyArr, ...trendReplyArr, ...commentReplyArr, ...trendCommentReply]
                                retArr.sort((preObj, nextObj) => {
                                    if (preObj.createdAt < nextObj.createdAt) return 1
                                    else if (preObj.createdAt > nextObj.createdAt) return -1
                                    else return 0
                                })
                                statusArr.sort((preObj, nextObj) => {
                                    if (preObj.createdAt < nextObj.createdAt) return 1
                                    else if (preObj.createdAt > nextObj.createdAt) return -1
                                    else return 0
                                })
                                res.status(200).json({
                                    code: 200,
                                    message: 'success',
                                    retArr,
                                    statusArr
                                })
                            }
                        }

                    } else {
                        res.status(200).json({
                            code: 200,
                            message: 'success',
                            replyArr,
                            statusArr
                        })
                    }
                }

            }
        } else {
            res.status(200).json({
                code: 200,
                message: 'success',
                replyArr,
                statusArr
            })
        }


    } catch (error) {
        next(error)
    }
}

//查询点赞
exports.getKudos = async (req, res, next) => {
    try {

        const user = req.user._id

        let kudosArr = []

        //文章点赞
        const articleKudos = await ArticleKudos.find({
            ofUser: user
        })
            .populate({
                path: 'user',
                select: 'username image'
            })
            .populate({
                path: 'article',
                select: 'title'
            })
            .then(ret => {
                kudosArr.push(...ret)
            })

        //动态点赞
        const trendKudos = await TrendKudos.find({
            ofUser: user
        })
            .populate({
                path: 'user',
                select: 'username image'
            })
            .populate({
                path: 'trend',
                select: 'body image'
            })
            .then(ret => {
                kudosArr.push(...ret)
            })

        //文章评论点赞
        const commentKudos = await CommentKudos.find({
            ofUser: user
        })
            .populate({
                path: 'user',
                select: 'username image'
            })
            .populate({
                path: 'comment',
                select: 'body'
            })
            .then(ret => {
                kudosArr.push(...ret)
            })

        //文章回复点赞
        const replyKudos = await ReplyKudos.find({
            ofUser: user
        })
            .populate({
                path: 'user',
                select: 'username image'
            })
            .populate({
                path: 'reply',
                select: 'body'
            })
            .then(ret => {
                kudosArr.push(...ret)
            })

        //动态评论点赞
        const trendCommentKudos = await TrendCommentKudos.find({
            ofUser: user
        })
            .populate({
                path: 'user',
                select: 'username image'
            })
            .populate({
                path: 'trendComment',
                select: 'body'
            })
            .then(ret => {
                kudosArr.push(...ret)
            })


        //动态回复点赞
        const trendReplyKudos = await TrendReplyKudos.find({
            ofUser: user
        })
            .populate({
                path: 'user',
                select: 'username image'
            })
            .populate({
                path: 'trendReply',
                select: 'body'
            })
            .then(ret => {
                kudosArr.push(...ret)
            })

        kudosArr.sort((preObj, nextObj) => {
            if (preObj.createdAt < nextObj.createdAt) return 1
            else if (preObj.createdAt > nextObj.createdAt) return -1
            else return 0
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            kudosArr
        })
    } catch (error) {
        next(error)
    }
}

//查询文章评论
exports.getArticleComment = async (req, res, next) => {
    try {

        const user = req.user._id
        const articleList = await Article.find({
            author: user
        })
        let articleCommentArr = []
        let commentStatusArr = []
        if (articleList.length > 0) {
            for (const i in articleList) {
                await Comment.find({
                    article: articleList[i]._id
                })
                    .populate({
                        path: 'user',
                        select: 'username image'
                    })
                    .populate({
                        path: 'article',
                        select: 'title'
                    })
                    .then(async (ret) => {
                        articleCommentArr.push(...ret)
                        for (const i in ret) {
                            await CommentKudos.findOne({
                                user,
                                comment: ret[i]._id
                            })
                                .then((kudosRet) => {
                                    if (kudosRet) {
                                        commentStatusArr.push({
                                            createdAt: ret[i].createdAt,
                                            status: 1
                                        })
                                    } else {
                                        commentStatusArr.push({
                                            createdAt: ret[i].createdAt,
                                            status: 0
                                        })
                                    }
                                })
                        }
                    })
            }
        }

        articleCommentArr.sort((preObj, nextObj) => {
            if (preObj.createdAt < nextObj.createdAt) return 1
            else if (preObj.createdAt > nextObj.createdAt) return -1
            else return 0
        })
        commentStatusArr.sort((preObj, nextObj) => {
            if (preObj.createdAt < nextObj.createdAt) return 1
            else if (preObj.createdAt > nextObj.createdAt) return -1
            else return 0
        })


        res.status(200).json({
            code: 200,
            message: 'success',
            articleCommentArr,
            commentStatusArr
        })
    } catch (error) {
        next(error)
    }
}

//查询动态评论
exports.getTrendComment = async (req, res, next) => {
    try {

        const user = req.user._id
        const trendList = await Trend.find({
            user
        })
        let trendCommentArr = []
        let trendCommentStatusArr = []
        if (trendList.length > 0) {
            for (const i in trendList) {
                await TrendComment.find({
                    trend: trendList[i]._id
                })
                    .populate({
                        path: 'user',
                        select: 'username image'
                    })
                    .populate({
                        path: 'trend',
                        select: 'body'
                    })
                    .then(async (ret) => {
                        trendCommentArr.push(...ret)
                        for (const i in ret) {
                            await TrendCommentKudos.findOne({
                                user,
                                trendComment: ret[i]._id
                            })
                                .then((kudosRet) => {
                                    if (kudosRet) {
                                        trendCommentStatusArr.push({
                                            createdAt: ret[i].createdAt,
                                            status: 1
                                        })
                                    } else {
                                        trendCommentStatusArr.push({
                                            createdAt: ret[i].createdAt,
                                            status: 0
                                        })
                                    }
                                })
                        }
                    })
            }
        }
        trendCommentArr.sort((preObj, nextObj) => {
            if (preObj.createdAt < nextObj.createdAt) return 1
            else if (preObj.createdAt > nextObj.createdAt) return -1
            else return 0
        })
        trendCommentStatusArr.sort((preObj, nextObj) => {
            if (preObj.createdAt < nextObj.createdAt) return 1
            else if (preObj.createdAt > nextObj.createdAt) return -1
            else return 0
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            trendCommentArr,
            trendCommentStatusArr
        })
    } catch (error) {
        next(error)
    }
}

//查询系统消息
exports.getSystemMessage = async (req, res, next) => {
    try {

        const userId = req.user._id

        let systemArr = []

        const noticesList = await Notice.find({}, {
            body: 0
        })

        for (const i in noticesList) {
            await NoticeChecked.findOne({
                notice: noticesList[i]._id,
                user: userId
            }).then(ret => {
                if (ret) {
                    noticesList[i].isChecked = true
                }
            })
        }

        systemArr.push(...noticesList)

        const articleMessage = await ArticleMessage.find({
            ofUser: userId
        })

        systemArr.push(...articleMessage)

        for (const i in articleMessage) {
            if (!articleMessage[i].isChecked) {
                articleMessage[i].isChecked = true
                await articleMessage[i].save()
            }
        }

        const trendMessage = await TrendMessage.find({
            ofUser: userId
        })

        systemArr.push(...trendMessage)

        for (const i in trendMessage) {
            if (!trendMessage[i].isChecked) {
                trendMessage[i].isChecked = true
                await trendMessage[i].save()
            }
        }

        const articleCommentMessage = await ReportCommentMessage.find({
            ofUser: userId
        })

        systemArr.push(...articleCommentMessage)

        for (const i in articleCommentMessage) {
            if (!articleCommentMessage[i].isChecked) {
                articleCommentMessage[i].isChecked = true
                await articleCommentMessage[i].save()
            }
        }

        const trendCommentMessage = await TrendReportCommentMessage.find({
            ofUser: userId
        })

        systemArr.push(...trendCommentMessage)

        for (const i in trendCommentMessage) {
            if (!trendCommentMessage[i].isChecked) {
                trendCommentMessage[i].isChecked = true
                await trendCommentMessage[i].save()
            }
        }

        systemArr.sort((preObj, nextObj) => {
            if (preObj.createdAt < nextObj.createdAt) return 1
            else if (preObj.createdAt > nextObj.createdAt) return -1
            else return 0
        })



        res.status(200).json({
            code: 200,
            message: 'success',
            systemArr
        })
    } catch (error) {
        next(error)
    }
}

//查询所有未查看消息
exports.getAllNotCheckedMes = async (req, res, next) => {
    try {
        const user = req.user._id

        let totalCount = 0

        //文章回复条数
        let articleRCount = 0
        const commentList = await Comment.find({
            user
        })
        if (commentList.length > 0) {
            for (const i in commentList) {
                await Reply.count({
                    comment: commentList[i]._id,
                    toReply: null,
                    isChecked: false
                }).then(ret => {
                    totalCount += ret
                    articleRCount += ret
                })
            }
        }
        const toReplyCount = await Reply.count({
            toReply: user,
            isChecked: false
        })
        totalCount += toReplyCount
        articleRCount += toReplyCount

        //动态回复
        const trendCommentList = await TrendComment.find({
            user
        })
        if (trendCommentList.length > 0) {
            for (const i in trendCommentList) {
                await TrendReply.count({
                    trendComment: trendCommentList[i]._id,
                    toReply: null,
                    isChecked: false
                }).then(ret => {
                    totalCount += ret
                    articleRCount += ret
                })
            }
        }

        const toTrendReplyCount = await TrendReply.count({
            toReply: user,
            isChecked: false
        })
        totalCount += toTrendReplyCount
        articleRCount += toTrendReplyCount

        //文章点赞
        let kudosCount = 0
        const articleKudosCount = await ArticleKudos.count({
            ofUser: user,
            isChecked: false
        })
        totalCount += articleKudosCount
        kudosCount += articleKudosCount

        // 文章评论点赞
        const articleCommentKudosCount = await CommentKudos.count({
            ofUser: user,
            isChecked: false
        })
        totalCount += articleCommentKudosCount
        kudosCount += articleCommentKudosCount

        // //文章回复点赞
        const articleReplyKudosCount = await ReplyKudos.count({
            ofUser: user,
            isChecked: false
        })
        totalCount += articleReplyKudosCount
        kudosCount += articleReplyKudosCount

        //动态点赞
        const trendKudosCount = await TrendKudos.count({
            ofUser: user,
            isChecked: false
        })
        totalCount += trendKudosCount
        kudosCount += trendKudosCount

        //动态评论点赞
        const trendCommentKudosCount = await TrendCommentKudos.count({
            ofUser: user,
            isChecked: false
        })
        totalCount += trendCommentKudosCount
        kudosCount += trendCommentKudosCount

        //动态回复点赞
        const trendReplyKudosCount = await TrendReplyKudos.count({
            ofUser: user,
            isChecked: false
        })
        totalCount += trendReplyKudosCount
        kudosCount += trendReplyKudosCount

        // 文章评论
        let articleCCount = 0
        const articleList = await Article.find({
            author: user
        })
        if (articleList.length > 0) {
            for (const i in articleList) {
                await Comment.count({
                    article: articleList[i]._id,
                    isChecked: false
                }).then(ret => {
                    totalCount += ret
                    articleCCount += ret
                })
            }
        }

        // 动态评论
        let trendCCount = 0
        const trendList = await Trend.find({
            user
        })
        if (trendList.length > 0) {
            for (const i in trendList) {
                await TrendComment.count({
                    trend: trendList[i]._id,
                    isChecked: false
                }).then(ret => {
                    totalCount += ret
                    trendCCount += ret
                })
            }
        }

        //系统信息

        let systemMessageCount = 0

        const noticesList = await Notice.find()

        if (noticesList.length > 0) {
            for (const i in noticesList) {
                await NoticeChecked.findOne({
                    notice: noticesList[i],
                    user: user
                }).then(ret => {
                    if (ret === null) {
                        totalCount += 1
                        systemMessageCount += 1
                    }
                })
            }
        }

        await ArticleMessage.count({
            ofUser: user,
            isChecked: false
        }).then(ret => {
            totalCount += ret
            systemMessageCount += ret
        })



        await TrendMessage.count({
            ofUser: user,
            isChecked: false
        }).then(ret => {
            totalCount += ret
            systemMessageCount += ret
        })




        await ReportCommentMessage.count({
            ofUser: user,
            isChecked: false
        }).then(ret => {
            totalCount += ret
            systemMessageCount += ret
        })



        await TrendReportCommentMessage.count({
            ofUser: user,
            isChecked: false
        }).then(ret => {
            totalCount += ret
            systemMessageCount += ret
        })


        res.status(200).json({
            code: 200,
            message: 'success',
            totalCount,
            replyCount: articleRCount,
            kudos: kudosCount,
            articleCommentCount: articleCCount,
            trendCommentCount: trendCCount,
            systemMessageCount
        })
    } catch (error) {
        next(error)
    }
}

//清除未查看回复(修改状态)
exports.changeUnCheckedReply = async (req, res, next) => {
    try {
        const user = req.user._id

        //清空未读文章回复
        const commentList = await Comment.find({
            user
        })
        if (commentList.length > 0) {
            for (const i in commentList) {
                await Reply.updateMany({
                    comment: commentList[i]._id,
                    toReply: null,
                    isChecked: false
                }, {
                    $set: {
                        isChecked: true
                    }
                })
            }
        }
        await Reply.updateMany({
            toReply: user,
            isChecked: false
        }, {
            $set: {
                isChecked: true
            }
        })

        //清空未读动态回复
        const trendCommentList = await TrendComment.find({
            user
        })
        if (trendCommentList.length > 0) {
            for (const i in trendCommentList) {
                await TrendReply.updateMany({
                    trendComment: trendCommentList[i]._id,
                    toReply: null,
                    isChecked: false
                }, {
                    $set: {
                        isChecked: true
                    }
                })
            }
        }

        await TrendReply.updateMany({
            toReply: user,
            isChecked: false
        }, {
            $set: {
                isChecked: true
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

//修改未读点赞状态
exports.changeUnCheckedKudos = async (req, res, next) => {
    try {
        const user = req.user._id


        //文章点赞
        await ArticleKudos.updateMany({
            ofUser: user,
            isChecked: false
        }, {
            $set: {
                isChecked: true
            }
        })

        // 文章评论点赞
        await CommentKudos.updateMany({
            ofUser: user,
            isChecked: false
        }, {
            $set: {
                isChecked: true
            }
        })

        // //文章回复点赞
        await ReplyKudos.updateMany({
            ofUser: user,
            isChecked: false
        }, {
            $set: {
                isChecked: true
            }
        })

        //动态点赞
        await TrendKudos.updateMany({
            ofUser: user,
            isChecked: false
        }, {
            $set: {
                isChecked: true
            }
        })

        //动态评论点赞
        await TrendCommentKudos.updateMany({
            ofUser: user,
            isChecked: false
        }, {
            $set: {
                isChecked: true
            }
        })

        //动态回复点赞
        await TrendReplyKudos.updateMany({
            ofUser: user,
            isChecked: false
        }, {
            $set: {
                isChecked: true
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

//修改未读文章评论状态
exports.changeUnCheckedArticleComment = async (req, res, next) => {
    try {
        const user = req.user._id

        // 文章评论
        const articleList = await Article.find({
            author: user
        })
        if (articleList.length > 0) {
            for (const i in articleList) {
                await Comment.updateMany({
                    article: articleList[i]._id,
                    isChecked: false
                }, {
                    $set: {
                        isChecked: true
                    }
                })
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

//修改未读文章评论状态
exports.changeUnCheckedTrendComment = async (req, res, next) => {
    try {
        const user = req.user._id

        // 动态评论
        const trendList = await Trend.find({
            user
        })
        if (trendList.length > 0) {
            for (const i in trendList) {
                await TrendComment.updateMany({
                    trend: trendList[i]._id,
                    isChecked: false
                }, {
                    $set: {
                        isChecked: true
                    }
                })
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

//获取公告详情
exports.getDetailNotice = async (req, res, next) => {
    try {

        const noticeId = req.params.noticeId
        const user = req.user._id

        const notice = await Notice.findById(noticeId)
            .populate({
                path: 'user',
                select: 'username image'
            })

        const noticeChecked = await NoticeChecked.findOne({
            notice: noticeId,
            user
        })

        if (noticeChecked === null) {
            const newNoticeChecked = new NoticeChecked({
                notice: noticeId,
                user
            })
            await newNoticeChecked.save()
        }else{
            notice.isChecked = true
        }

        res.status(200).json({
            code: 200,
            message: 'success',
            notice
        })
    } catch (error) {
        next(error)
    }
}
