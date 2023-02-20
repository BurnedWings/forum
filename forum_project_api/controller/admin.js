const { TrendReplyKudos, TrendCommentKudos, ReplyKudos, CommentKudos, ReportType, Forbid, ArticleMessage, Notice, ArticleType, Admin, User, Article, Comment, Reply, TrendComment, TrendReply, ArticleReport, CommentReport, ReportCommentMessage, Trend, TrendMessage, TrendReport, TrendCommentReport, TrendReportCommentMessage, Swiper, Birthday, ArticleCollection, ArticleCollectionItem } = require('../model')
const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const formidable = require('formidable')
const config = require('../config/config.default')
const createJwt = require('../util/createJwt')
const md5 = require('../util/md5')

//创建管理员
exports.createAdmin = async (req, res, next) => {
    try {

        const admin = req.body.admin

        const username = admin.username

        const ret = await Admin.findOne({
            username
        })

        if (ret) {
            return res.status(200).json({
                code: 201,
                message: '该账号已存在'
            })
        }

        await new Admin(admin).save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })

    } catch (error) {
        next(error)
    }
}

//更新管理员
exports.updateTheAdmin = async (req, res, next) => {
    try {

        const newAdmin = req.body.admin

        const admin = await Admin.findById(newAdmin._id)

        admin.username = newAdmin.username

        if (newAdmin.password) {
            admin.password = newAdmin.password
        }

        if (newAdmin.image) {
            admin.image = newAdmin.image
        }

        admin.permissionsList = newAdmin.permissionsList

        await admin.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })

    } catch (error) {
        next(error)
    }
}

//设置管理员头像
exports.setAdminImage = async (req, res, next) => {
    try {
        const form = formidable({ multiples: true, uploadDir: config.avatarDir, keepExtensions: true });
        // 获取协议（http或者https）
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return next(err)
            }
            let url = 'avatars/' + files.file.newFilename

            res.status(200).json({
                code: 200,
                message: 'success',
                url
            })
        });
    } catch (error) {
        next(error)
    }
}

//查询所有管理员信息
exports.getOtherAdmin = async (req, res, next) => {
    try {

        const totalCount = await Admin.count({
            isSuper: false
        })

        const adminList = await Admin.find({
            isSuper: false
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            adminList,
            totalCount
        })
    } catch (error) {
        next(error)
    }
}

//管理员登录
exports.adminLogin = async (req, res, next) => {
    try {

        const user = req.body

        await Admin.findOne({
            username: user.username
        }).select(['password', 'username', 'image'])
            .then(async (ret) => {
                if (ret && ret.password === md5(user.password)) {
                    const token = await createJwt({ userId: ret._id }, 60 * 60 * 24 * 2)
                    const refToken = await createJwt({ userId: ret._id }, 60 * 60 * 24 * 7)
                    res.status(200).json({
                        code: 200,
                        message: 'success',
                        data: {
                            token,
                            refToken
                        }
                    })
                } else {
                    res.status(202).json({
                        code: 202,
                        message: '登录失败',
                    })
                }
            })


    } catch (error) {
        next(error)
    }
}

//获取管理员信息
exports.getAdminInfo = async (req, res, next) => {
    try {
        const user = req.user

        res.status(200).json({
            code: 200,
            message: 'success',
            data: user
        })

    } catch (error) {
        next(error)
    }
}

//刷新token
exports.refAdminToken = async (req, res, next) => {
    try {
        const user = req.user.toJSON()
        const token = await createJwt({ userId: user._id }, 60 * 60 * 24 * 2)
        const refToken = await createJwt({ userId: user._id }, 60 * 60 * 24 * 7)
        res.status(200).json({
            code: 200,
            message: 'success',
            token,
            refToken
        })
    } catch (error) {
        next(error)
    }
}

//添加文章类型
exports.createArticleType = async (req, res, next) => {
    try {
        const type = await ArticleType.findOne({
            content: req.body.type.content
        })

        if (type) {
            return res.status(200).json({
                code: 200,
                message: '该类型已经存在了哦~'
            })
        } else {
            new ArticleType(req.body.type).save()
        }


        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取前台用户性别数据
exports.getUserGenderInfo = async (req, res, next) => {
    try {

        const maleNum = await User.count({
            gender: 1
        })

        const femaleNum = await User.count({
            gender: 2
        })
        let secrecyNum = await User.count({
            gender: 3
        })

        const nullNum = await User.count({
            gender: null
        })
        secrecyNum += nullNum

        res.status(200).json({
            code: 200,
            message: 'success',
            data: [
                {
                    name: '男',
                    value: maleNum
                }, {
                    name: '女',
                    value: femaleNum
                }, {
                    name: '保密',
                    value: secrecyNum
                }
            ]
        })
    } catch (error) {
        next(error)
    }
}

//获取文章类型数据
exports.getTypeArticleCount = async (req, res, next) => {
    try {
        const typeList = await ArticleType.find()
        let nameArr = []
        let valueArr = []
        let idArr = []
        for (const i in typeList) {
            await Article.find({
                category: typeList[i]._id,
                status: 0,
                isAudit: true
            }).then(ret => {
                nameArr.push(typeList[i].content)
                valueArr.push(ret.length)
                idArr.push(typeList[i]._id)
            })
        }
        res.status(200).json({
            code: 200,
            message: 'success',
            name: nameArr,
            value: valueArr,
            idArr
        })
    } catch (error) {

    }
}

//更新文章类型
exports.updateTheArticleType = async (req, res, next) => {
    try {

        const type = req.body.type

        const articleType = await ArticleType.findById(type.id)

        articleType.content = type.content

        await articleType.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {

    }
}

//获取七天评论
exports.commentCountForWek = async (req, res, next) => {
    try {

        var days = [];
        //当天
        var Date8 = new Date();
        //前一天
        var Date7 = new Date(Date8.getTime() - 24 * 60 * 60 * 1000)
        //前两天
        var Date6 = new Date(Date8.getTime() - 48 * 60 * 60 * 1000)
        //前三天
        var Date5 = new Date(Date8.getTime() - 72 * 60 * 60 * 1000)
        //前四天
        var Date4 = new Date(Date8.getTime() - 96 * 60 * 60 * 1000)
        //前五天
        var Date3 = new Date(Date8.getTime() - 120 * 60 * 60 * 1000)
        //前六天
        var Date2 = new Date(Date8.getTime() - 144 * 60 * 60 * 1000)
        //前七天
        var Date1 = new Date(Date8.getTime() - 168 * 60 * 60 * 1000)
        days[0] = Date1
        days[1] = Date2
        days[2] = Date3
        days[3] = Date4
        days[4] = Date5
        days[5] = Date6
        days[6] = Date7
        days[7] = Date8
        let commentCountArr = [0, 0, 0, 0, 0, 0, 0]

        for (let i = 0; i < 7; i++) {
            await Comment.count({
                createdAt: {
                    $gte: days[i],
                    $lt: days[parseInt(i) + 1]
                }
            }).then(ret => {
                commentCountArr[i] += ret
            })
            await Reply.count({
                createdAt: {
                    $gte: days[i],
                    $lt: days[parseInt(i) + 1]
                }
            }).then(ret => {
                commentCountArr[i] += ret
            })
            await TrendComment.count({
                createdAt: {
                    $gte: days[i],
                    $lt: days[parseInt(i) + 1]
                }
            }).then(ret => {
                commentCountArr[i] += ret
            })
            await TrendReply.count({
                createdAt: {
                    $gte: days[i],
                    $lt: days[parseInt(i) + 1]
                }
            }).then(ret => {
                commentCountArr[i] += ret
            })
        }


        res.status(200).json({
            code: 200,
            message: 'success',
            commentCountArr
        })
    } catch (error) {

    }
}

//获取用户信息列表
exports.getUserInfoList = async (req, res, next) => {
    try {

        let offset = req.body.offset
        let status = req.body.status
        if (!offset) {
            offset = 0
        }
        let userCount
        let userList

        if (status) {
            status = status - 1
            userCount = await User.count({
                status
            })
            userList = await User.find({
                status
            }).sort({
                violateCount: 'desc',
                createdAt: 'asc'
            })
                .limit(6)
                .skip(offset * 6)
        } else {
            userCount = await User.count()
            userList = await User.find()
                .sort({
                    violateCount: 'desc',
                    createdAt: 'asc'
                })
                .limit(6)
                .skip(offset * 6)
        }

        res.status(200).json({
            code: 200,
            message: 'success',
            userList,
            userCount
        })
    } catch (error) {
        next(error)
    }
}

//禁言用户
exports.forbidTheUser = async (req, res, next) => {
    try {

        const userId = req.body.user

        const forbid = new Forbid({
            user: userId
        })
        await forbid.save()

        const user = await User.findById(userId)
        user.status = 1
        await user.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//解除用户禁言
exports.cancelForbidTheUser = async (req, res, next) => {
    try {

        const userId = req.body.user
        await Forbid.deleteOne({
            user: userId
        })
        const user = await User.findById(userId)
        user.status = 0
        await user.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//全部禁言
exports.forbidAllUser = async (req, res, next) => {
    try {

        await User.updateMany({
            status: 1
        })


        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//解除全部禁言
exports.cancelForbidAllUser = async (req, res, next) => {
    try {

        await User.updateMany({
            status: 0
        })

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//公告图片处理
exports.handleNoticeImg = async (req, res, next) => {
    try {

        const form = formidable({ multiples: true, uploadDir: config.noticeDir, keepExtensions: true });
        // 获取协议（http或者https）
        const ht = req.protocol
        // 获取域名和端口号
        const host = req.headers.host
        form.parse(req, (err, fields, files) => {
            if (err) {
                return next(err)
            }

            let url = ht + "://" + host + '/notices/' + files.files.newFilename
            res.status(200).json({
                code: 200,
                message: 'success',
                url
            })
        });

    } catch (error) {
        next(error)
    }
}

//公告提交
exports.createNotice = async (req, res, next) => {
    try {

        const notice = req.body.notice
        new Notice(notice).save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })

    } catch (error) {
        next(error)
    }
}

//查询待审核文章
exports.getNotAuditArticle = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }

        const totalCount = await Article.count({
            isAudit: false,
            status: 0
        })
        const articleList = await Article.find({
            isAudit: false,
            status: 0
        }).populate('author').populate({
            path: 'category',
            select: 'content'
        })
            .limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            articleList,
            totalCount
        })
    } catch (error) {
        next(error)
    }
}

//通过审核
exports.auditTheArticle = async (req, res, next) => {
    try {

        const articleId = req.body.articleId
        const article = await Article.findById(articleId)

        const user = await User.findById(article.author)
        user.articleCount += 1
        await user.save()
        article.isAudit = true
        article.status = 0
        await article.save()

        const tagList = article.tagList

        for (const i in tagList) {
            const collection = await ArticleCollection.findOne({
                user: article.author,
                keyWord: tagList[i]
            })

            if (collection) {
                collection.articleList.push(article._id)
                await collection.save()
                const collectionItem = new ArticleCollectionItem({
                    user: article.author,
                    article: article._id,
                    articleCollection: collection._id
                })
                await collectionItem.save()
            }
        }

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//文章状态修改通知(过审成功，退回等)
exports.articleStatusMessage = async (req, res, next) => {
    try {

        const message = req.body.message

        new ArticleMessage(message).save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取已审核文章
exports.getAuditArticle = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }
        const totalCount = await Article.count({
            isAudit: true,
            status: 0
        })
        const articleList = await Article.find({
            isAudit: true,
            status: 0
        }).populate('author').populate({
            path: 'category',
            select: 'content'
        }).limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            articleList,
            totalCount
        })
    } catch (error) {
        next(error)
    }
}

//退回文章
exports.backTheArticle = async (req, res, next) => {
    try {

        const articleId = req.body.articleId
        const article = await Article.findById(articleId)
        article.status = 1


        const user = await User.findById(article.author)
        user.violateCount += 1
        if (article.isAudit) {
            user.articleCount -= 1
        } else {
            article.isAudit = true
        }
        await user.save()
        await article.save()

        const collectionItemList = await ArticleCollectionItem.find({
            user: article.author,
            article: article._id
        })

        for (const j in collectionItemList) {
            const collection = await ArticleCollection.findOne({
                _id: collectionItemList[j].articleCollection
            })
            for (const i in collection.articleList) {
                if (collection.articleList[i].toString() === collectionItemList[j].article.toString()) {
                    collection.articleList.splice(i, 1)
                    await collection.save()
                }
            }
            await collectionItemList[j].remove()
        }


        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//查询已退回文章
exports.getBackArticle = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }
        const totalCount = await Article.count({
            status: 1
        })
        const articleList = await Article.find({
            status: 1
        }).populate('author').populate({
            path: 'category',
            select: 'content'
        }).limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            articleList,
            totalCount
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//生成违规类型
exports.createReportType = async (req, res, next) => {
    try {

        const reportType = req.body.reportType

        const type = new ReportType(reportType)
        await type.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取举报文章消息
exports.getArticleReportMessage = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }
        const totalCount = await ArticleReport.count()
        const articleReportList = await ArticleReport.find()
            .populate({
                path: 'user',
                select: 'image username'
            }).populate({
                path: 'type',
                select: 'content'
            }).populate({
                path: 'article',
                select: 'createdAt title status'
            }).limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            articleReportList,
            totalCount
        })
    } catch (error) {
        next(error)
    }
}

//获取单条文章信息
exports.getCurrentArticle = async (req, res, next) => {
    try {

        const articleId = req.params.articleId

        const article = await Article.findOne({
            _id: articleId,
            status: 0
        })
            .populate('author').populate({
                path: 'category',
                select: 'content'
            })

        res.status(200).json({
            code: 200,
            message: 'success',
            articleList: [article],
            totalCount: 1
        })
    } catch (error) {
        next(error)
    }
}

//完成文章举报任务
exports.finishArticleReport = async (req, res, next) => {
    try {

        const articleReportId = req.body.articleReportId

        await ArticleReport.findByIdAndDelete(articleReportId)

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        next(error)
    }
}

//获取文章评论举报信息
exports.getArticleCommentReport = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }
        const totalCount = await CommentReport.count()
        const commentReport = await CommentReport.find()
            .populate({
                path: 'user',
                select: 'image username'
            }).populate({
                path: 'ofUser',
                select: 'image username'
            }).populate({
                path: 'type',
                select: 'content'
            }).populate({
                path: 'comment',
                select: 'body createdAt article'
            }).populate({
                path: 'reply',
                select: 'body createdAt'
            })
            .limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            commentReport,
            totalCount
        })
    } catch (error) {
        next(error)
    }
}

//删除评论
exports.deleteReportComment = async (req, res, next) => {
    try {

        //删除评论
        const commentId = req.body.comment
        const articleId = req.body.article


        const comment = await Comment.findById(commentId)

        await comment.remove()

        const article = await Article.findById(articleId)

        const user = await User.findById(comment.user)

        user.violateCount += 1

        await user.save()

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
                const reply = replyList[i]

                await ReplyKudos.deleteMany({
                    reply: reply._id
                })
                const arr = await CommentReport.find({
                    reply: replyList[i]._id
                })
                if (arr.length > 0) {
                    for (const j in arr) {
                        await new ReportCommentMessage({
                            reply: reply.body,
                            ofUser: arr[j].user
                        }).save()
                        await arr[j].remove()
                        if (arr.length === parseInt(j) + 1) {
                            const replyUser = await User.findById(arr[j].ofUser)
                            replyUser.violateCount += 1
                            await replyUser.save()
                        }

                    }
                }
                await replyList[i].remove()

            }
        }

        // //添加删除评论成功通知
        // const message = new ReportCommentMessage(req.body.message)

        // await message.save()

        const reportList = await CommentReport.find({
            comment: commentId
        })

        if (reportList.length > 0) {
            for (const i in reportList) {
                await new ReportCommentMessage({
                    comment: comment.body,
                    ofUser: reportList[i].user
                }).save()
                await reportList[i].remove()
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

//删除回复
exports.deleteReportReply = async (req, res, next) => {
    try {
        //删除回复
        const replyId = req.body.reply
        const reply = await Reply.findById(replyId)
        const commentId = reply.comment
        const articleId = reply.article

        const comment = await Comment.findById(commentId)
        const article = await Article.findById(articleId)

        const user = await User.findById(reply.user)

        user.violateCount += 1

        await user.save()

        const replyList = comment.replyList
        let targetIndex
        for (const i in replyList) {
            if (replyId === replyList[i].toString()) {
                targetIndex = i
            }
        }
        comment.replyList.splice(targetIndex, 1)

        await ReplyKudos.deleteMany({
            reply: replyId
        })
        await comment.save()
        article.commentsCount -= 1
        await article.save()
        await reply.remove()

        //添加删除评论成功通知
        // const message = new ReportCommentMessage(req.body.message)

        // await message.save()

        //完成文章评论举报任务
        // const taskId = req.body.taskId

        // await CommentReport.findByIdAndDelete(taskId)

        const reportList = await CommentReport.find({
            reply: replyId
        })

        if (reportList.length > 0) {
            for (const i in reportList) {
                await new ReportCommentMessage({
                    reply: reply.body,
                    ofUser: reportList[i].user
                }).save()
                await reportList[i].remove()
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

//举报成功任务通知
exports.reportCommentSuccessMessage = async (req, res, next) => {
    try {

        const message = new ReportCommentMessage(req.body.message)

        await message.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//完成文章评论举报任务
exports.finishTheArticleCommentTask = async (req, res, next) => {
    try {

        const taskId = req.body.taskId

        await CommentReport.findByIdAndDelete(taskId)

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取待审核动态
exports.getNotAuditTrend = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }

        const totalCount = await Trend.count({
            isAudit: false,
            status: 0
        })

        const trendList = await Trend.find({
            isAudit: false,
            status: 0
        }).populate({
            path: 'user',
            select: 'image username violateCount'
        })
            .limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            trendList,
            totalCount
        })
    } catch (error) {
        next(error)
    }
}

//通过动态审核
exports.auditTheTrend = async (req, res, next) => {
    try {
        const trendId = req.body.trendId
        const trend = await Trend.findById(trendId)
        trend.isAudit = true

        const user = await User.findById(trend.user)
        user.trendsCount += 1
        await user.save()
        await trend.save()

        const message = new TrendMessage({
            type: 1,
            trend: trend.body,
            ofUser: trend.user
        })

        await message.save()

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        next(error)
    }
}

//锁定动态
exports.lockTheTrend = async (req, res, next) => {
    try {

        const trendId = req.body.trendId

        const trend = await Trend.findById(trendId)

        trend.status = 1

        const user = await User.findById(trend.user)

        if (trend.isAudit) {
            user.trendsCount -= 1
        } else {
            trend.isAudit = true
        }
        user.violateCount += 1
        await user.save()
        await trend.save()

        const myMessage = req.body.message

        const message = new TrendMessage({
            type: 2,
            message: myMessage,
            trend: trend.body,
            ofUser: trend.user
        })

        await message.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取已过审动态
exports.getAuditTrend = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }

        const totalCount = await Trend.count({
            isAudit: true,
            status: 0
        })

        const trendList = await Trend.find({
            isAudit: true,
            status: 0
        }).populate({
            path: 'user',
            select: 'image username violateCount'
        }).limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            totalCount,
            trendList
        })
    } catch (error) {
        next(error)
    }
}

//获取动态举报信息
exports.getTrendReportMessage = async (req, res, next) => {
    try {


        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }

        const totalCount = await TrendReport.count()

        const trendList = await TrendReport.find()
            .populate({
                path: 'user',
                select: 'image username'
            }).populate({
                path: 'type',
                select: 'content'
            }).populate({
                path: 'trend',
                select: 'status'
            }).limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            totalCount,
            trendList
        })
    } catch (error) {
        next(error)
    }
}

//获取单条动态详情
exports.getCurrentTrend = async (req, res, next) => {
    try {

        const trendId = req.body.trendId

        const trend = await Trend.findOne({
            _id: trendId,
            status: 0
        })
            .populate({
                path: 'user',
                select: 'image username violateCount'
            })

        res.status(200).json({
            code: 200,
            message: 'success',
            trendList: [trend],
            totalCount: 1

        })
    } catch (error) {
        next(error)
    }
}

//完成动态举报任务
exports.finishTrendReportTask = async (req, res, next) => {
    try {

        const trendReportId = req.body.trendReportId

        await TrendReport.findByIdAndDelete(trendReportId)

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        next(error)
    }
}

//获取动态评论举报信息
exports.getTrendCommentReportMessage = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }

        const totalCount = await TrendCommentReport.count()
        const reportList = await TrendCommentReport.find()
            .populate({
                path: 'comment',
                select: 'body createdAt trend'
            })
            .populate({
                path: 'reply',
                select: 'body createdAt'
            })
            .populate({
                path: 'type',
                select: 'content'
            })
            .populate({
                path: 'user',
                select: 'image'
            })
            .populate({
                path: 'ofUser',
                select: 'image'
            })
            .limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            totalCount,
            reportList
        })
    } catch (error) {
        next(error)
    }
}

//完成动态评论举报任务
exports.finishTrendCommentReport = async (req, res, next) => {
    try {

        const taskId = req.body.taskId

        await TrendCommentReport.findByIdAndDelete(taskId)

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        next(error)
    }
}

//删除动态评论
exports.deleteTrendComment = async (req, res, next) => {
    try {

        //删除评论
        const commentId = req.body.comment
        const trendId = req.body.trend

        const comment = await TrendComment.findById(commentId)
        await comment.remove()

        const user = await User.findById(comment.user)

        user.violateCount += 1

        await user.save()

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
                const trendReply = replyList[i]
                await TrendReplyKudos.deleteMany({
                    trendReply: trendReply._id
                })

                const arr = await TrendCommentReport.find({
                    reply: replyList[i]._id
                })
                if (arr.length > 0) {
                    for (const j in arr) {
                        await new TrendReportCommentMessage({
                            reply: trendReply.body,
                            ofUser: arr[j].user
                        }).save()
                        await arr[j].remove()
                        if (arr.length === parseInt(j) + 1) {
                            const replyUser = await User.findById(arr[j].ofUser)
                            replyUser.violateCount += 1
                            await replyUser.save()
                        }
                    }
                }

                await replyList[i].remove()
            }
        }

        //其他任务
        const reportList = await TrendCommentReport.find({
            comment: commentId
        })

        if (reportList.length > 0) {
            for (const i in reportList) {
                await new TrendReportCommentMessage({
                    comment: comment.body,
                    ofUser: reportList[i].user
                }).save()
                await reportList[i].remove()
            }
        }

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//删除动态回复
exports.deleteTrendReply = async (req, res, next) => {
    try {

        //删除回复
        const replyId = req.body.reply
        const reply = await TrendReply.findById(replyId)
        const commentId = reply.trendComment
        const trendId = reply.trend

        const comment = await TrendComment.findById(commentId)
        const trend = await Trend.findById(trendId)
        const replyList = comment.replyList
        let targetIndex
        for (const i in replyList) {
            if (replyId === replyList[i].toString()) {
                targetIndex = i
            }
        }
        comment.replyList.splice(targetIndex, 1)

        await TrendReplyKudos.deleteMany({
            trendReply: replyId
        })
        await comment.save()
        trend.commentsCount -= 1
        await trend.save()
        await reply.remove()

        //其他任务
        const reportList = await TrendCommentReport.find({
            reply: replyId
        })

        if (reportList.length > 0) {
            for (const i in reportList) {
                await new TrendReportCommentMessage({
                    reply: reply.body,
                    ofUser: reportList[i].user
                }).save()
                await reportList[i].remove()
            }
        }

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        next(error)
    }
}

//设置轮播图
exports.uploadSwiper = async (req, res, next) => {
    try {
        const form = formidable({ multiples: true, uploadDir: config.swiperDir, keepExtensions: true });
        // 获取协议（http或者https）
        const ht = req.protocol
        // 获取域名和端口号
        const host = req.headers.host
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return next(err)
            }
            let url = 'swipers/' + files.files.newFilename

            const swiper = new Swiper({
                image: url
            })
            await swiper.save()

            res.status(200).json({
                code: 200,
                message: 'success'
            })
        });
    } catch (error) {
        next(error)
    }
}

//查询轮播图
exports.getSwiper = async (req, res, next) => {
    try {

        const swiperList = await Swiper.find()

        res.status(200).json({
            code: 200,
            message: 'success',
            swiperList
        })
    } catch (error) {
        next(error)
    }
}

//添加轮播图描述
exports.updateSwiperDescription = async (req, res, next) => {
    try {

        const description = req.body.description

        const swiperId = req.body.swiperId

        const swiper = await Swiper.findById(swiperId)

        swiper.description = description

        await swiper.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//删除轮播图
exports.removeSwiper = async (req, res, next) => {
    try {

        const swiperId = req.body.swiperId

        await Swiper.findByIdAndDelete(swiperId)

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取未推荐文章
exports.getNotRecommendArticle = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 1
        }
        const recommendCount = await Article.count({
            isAudit: true,
            status: 0,
            isRecommend: true
        })
        const totalCount = await Article.count({
            isAudit: true,
            status: 0,
            isRecommend: false
        })
        const articleList = await Article.find({
            isAudit: true,
            status: 0,
            isRecommend: false
        }).populate('author').populate({
            path: 'category',
            select: 'content'
        })
            .sort({
                clicksCount: 'desc'
            }).limit(6)
            .skip((offset - 1) * 6)

        res.status(200).json({
            code: 200,
            message: 'success',
            articleList,
            totalCount,
            recommendCount
        })
    } catch (error) {
        next(error)
    }
}

//推荐文章
exports.recommendTheArticle = async (req, res, next) => {
    try {

        const articleId = req.body.articleId

        const article = await Article.findById(articleId)

        article.isRecommend = true

        await article.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//获取推荐文章
exports.getRecommendArticle = async (req, res, next) => {
    try {

        const totalCount = await Article.count({
            isAudit: true,
            status: 0,
            isRecommend: true
        })
        const articleList = await Article.find({
            isAudit: true,
            status: 0,
            isRecommend: true
        }).populate('author').populate({
            path: 'category',
            select: 'content'
        })
            .sort({
                clicksCount: 'desc'
            })

        res.status(200).json({
            code: 200,
            message: 'success',
            articleList,
            totalCount
        })
    } catch (error) {
        next(error)
    }
}

//取消推荐
exports.cancelArticleRecommend = async (req, res, next) => {
    try {

        const articleId = req.body.articleId

        const article = await Article.findById(articleId)

        article.isRecommend = false

        await article.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//大屏年龄分布
exports.getAgeInfo = async (req, res, next) => {
    try {

        let nowDate = new Date();

        //10年前
        let tenYearsAgo = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000 * 365 * 10)

        let fifteenYearsAgo = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000 * 365 * 15)

        let twentyYearsAgo = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000 * 365 * 20)

        let twentyFiveYearsAgo = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000 * 365 * 25)

        let thirtyYearsAgo = new Date(nowDate.getTime() - 24 * 60 * 60 * 1000 * 365 * 30)

        // console.log(tenYearsAgo)
        // console.log(fifteenYearsAgo)
        // console.log(twentyYearsAgo)
        // console.log(twentyFiveYearsAgo)
        // console.log(thirtyFiveYearsAgo)

        let arr = []

        await User.count({
            birthday: {
                $gte: fifteenYearsAgo,
                $lt: tenYearsAgo
            }
        }).then(ret => {
            arr.push({
                name: '10-15',
                value: ret
            })
        })

        await User.count({
            birthday: {
                $gte: twentyYearsAgo,
                $lt: fifteenYearsAgo
            }
        }).then(ret => {
            arr.push({
                name: '15-20',
                value: ret
            })
        })

        await User.count({
            birthday: {
                $gte: twentyFiveYearsAgo,
                $lt: twentyYearsAgo
            }
        }).then(ret => {
            arr.push({
                name: '20-25',
                value: ret
            })
        })

        await User.count({
            birthday: {
                $gte: thirtyYearsAgo,
                $lt: twentyFiveYearsAgo
            }
        }).then(ret => {
            arr.push({
                name: '25-30',
                value: ret
            })
        })

        let other = 0

        await User.count({
            birthday: {
                $lt: thirtyYearsAgo
            }
        }).then(ret => {
            other += ret
        })

        await User.count({
            birthday: {
                $gte: tenYearsAgo
            }
        }).then(ret => {
            other += ret
            arr.push({
                name: '其他',
                value: other
            })
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            arr
        })
    } catch (error) {
        next(error)
    }
}

//七天新增用户
exports.newUserWeek = async (req, res, next) => {
    try {
        var days = [];
        //当天
        var Date8 = new Date();
        //前一天
        var Date7 = new Date(Date8.getTime() - 24 * 60 * 60 * 1000)
        //前两天
        var Date6 = new Date(Date8.getTime() - 48 * 60 * 60 * 1000)
        //前三天
        var Date5 = new Date(Date8.getTime() - 72 * 60 * 60 * 1000)
        //前四天
        var Date4 = new Date(Date8.getTime() - 96 * 60 * 60 * 1000)
        //前五天
        var Date3 = new Date(Date8.getTime() - 120 * 60 * 60 * 1000)
        //前六天
        var Date2 = new Date(Date8.getTime() - 144 * 60 * 60 * 1000)
        //前七天
        var Date1 = new Date(Date8.getTime() - 168 * 60 * 60 * 1000)
        days[0] = Date1
        days[1] = Date2
        days[2] = Date3
        days[3] = Date4
        days[4] = Date5
        days[5] = Date6
        days[6] = Date7
        days[7] = Date8
        let userCountArr = [0, 0, 0, 0, 0, 0, 0]

        for (let i = 0; i < 7; i++) {
            await User.count({
                createdAt: {
                    $gte: days[i],
                    $lt: days[parseInt(i) + 1]
                }
            }).then(ret => {
                userCountArr[i] += ret
            })
        }


        res.status(200).json({
            code: 200,
            message: 'success',
            userCountArr
        })
    } catch (error) {
        next(error)
    }
}

//七天新增用户
exports.notFinishTask = async (req, res, next) => {
    try {

        let taskArr = []

        await Article.count({
            isAudit: false
        }).then(ret => {
            taskArr.push(ret)
        })

        await ArticleReport.count()
            .then(ret => {
                taskArr.push(ret)
            })

        await CommentReport.count()
            .then(ret => {
                taskArr.push(ret)
            })

        await Trend.count({
            isAudit: false
        }).then(ret => {
            taskArr.push(ret)
        })

        await TrendReport.count()
            .then(ret => {
                taskArr.push(ret)
            })

        await TrendCommentReport.count()
            .then(ret => {
                taskArr.push(ret)
            })

        res.status(200).json({
            code: 200,
            message: 'success',
            taskArr
        })
    } catch (error) {
        next(error)
    }
}

//获取单个用户数据
exports.getOneUserInfo = async (req, res, next) => {
    try {

        const userId = req.params.userId

        const user = await User.findById(userId)

        res.status(200).json({
            code: 200,
            message: 'success',
            user
        })
    } catch (error) {
        next(error)
    }
}

//生成用户接口
exports.produceUser = async (req, res, next) => {
    try {

        const user = new User(req.body.user)

        await user.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//修改用户生日接口
exports.updateUserBri = async (req, res, next) => {
    try {

        const username = req.body.username
        const bir = req.body.gender

        const user = await User.findOne({
            username
        })
        user.birthday = bir
        await user.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//生成生日表项
exports.createBirthday = async (req, res, next) => {
    try {

        const userList = await User.find()

        for (const i in userList) {
            if (userList[i].birthday) {
                let userBirthday = userList[i].birthday.getMonth() + '/' + userList[i].birthday.getDate()
                await new Birthday({
                    user: userList[i]._id,
                    email: userList[i].email,
                    birthday: userBirthday
                }).save()
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