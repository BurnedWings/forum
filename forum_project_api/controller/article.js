const { Article, ArticleType, User } = require('../model')
const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const formidable = require('formidable')
const config = require('../config/config.default')
const events = require('events')
const ee = new events()

//创建文章
exports.createArticle = async (req, res, next) => {
    try {
        const article = new Article(req.body.article)
        article.author = req.user._id
        await article.save()

        // const user = await User.findById(req.user._id)
        // const newArticleCount = user.articleCount + 1

        // await User.findByIdAndUpdate(req.user._id, {
        //     articleCount: newArticleCount
        // })


        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取文章列表
exports.getArticleList = async (req, res, next) => {
    try {

        let offset = req.body.offset
        if (!offset) {
            offset = 0
        }

        const category = req.body.typeId

        const totalCount = await Article.count({
            category,
            isAudit: true,
            status: 0
        })
        const articles = await Article.find({
            category,
            isAudit: true,
            status: 0
        })
            .populate('author')
            .limit(4)
            .skip(offset * 4)
            .sort({
                createdAt: 'desc'
            })
        const articlesCount = articles.length
        // let token = req.headers.authorization
        // if (token) {
        //     const decodedToken = await verify(token, jwtSecret)
        //     const user = await User.findById(decodedToken.userId)

        //     articles.forEach( async (article) => {
        //         ee.once('change',(article)=>{
        //             console.log(123)
        //             article.isKudos=true
        //         })
        //         const ret = await ArticleKudos.findOne({
        //             article: article._id,
        //             user: user._id
        //         })
        //         console.log(ret)
        //         if(ret){
        //             ee.emit('change',article)
        //         }

        //     });
        // }
        // articles.forEach(item=>{
        //     console.log(item.isKudos)
        // })
        res.status(200).json({
            code: 200,
            message: 'success',
            data: articles,
            articlesCount,
            totalCount
        })
    } catch (error) {
        next(error)
    }
}

//获取文章详情
exports.getDetailArticle = async (req, res, next) => {
    try {
        const articleId = req.body.articleId
        const detailArticle = await Article.findOne({
            _id: articleId,
            isAudit: true,
            status: 0
        })
            .populate('author')

        if (detailArticle) {
            let timer = {}
            //清除定时器
            clearTimeout(timer)
            const clicksCount = detailArticle.clicksCount + 1

            //开启定时器
            timer = setTimeout(async () => {
                await Article.findByIdAndUpdate(articleId, {
                    clicksCount
                })
            }, 30000)

            res.status(200).json({
                code: 200,
                message: 'success',
                data: detailArticle,
            })
        } else {
            res.status(200).json({
                code: 200,
                data: null
            })
        }
    } catch (error) {
        next(error)
    }
}

//获取编辑文章详情
exports.getToEditDetailArticle = async (req, res, next) => {
    try {

        const articleId = req.body.articleId
        const detailArticle = await Article.findOne({
            _id: articleId
        }).populate('author')
        
        res.status(200).json({
            code: 200,
            message: 'success',
            data: detailArticle,
        })
    } catch (error) {
        next(error)
    }
}
//获取待审核文章详情
exports.getNotAuditArticle = async (req, res, next) => {
    try {
        const articleId = req.body.articleId

        const article = await Article.findById(articleId)

        res.status(200).json({
            code: 200,
            message: 'success',
            data: article
        })
    } catch (error) {
        next(error)
    }
}

//获取指定用户文章
exports.getArticlesOfOneUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const articles = await Article.find({
            author: userId,
            isAudit: true,
            status: 0
        }).sort({
            createdAt: 'desc'
        })
        res.status(200).json({
            code: 200,
            message: 'success',
            articles
        })
    } catch (error) {
        next(error)
    }
}

//获取登录用户未审核以及退回文章文章
exports.getNotAuditAndBackArticle = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const articles = await Article.find({
            author: userId,
            $or: [
                {
                    isAudit: false
                },
                {
                    status: 1
                }
            ]
        }).sort({
            createdAt: 'desc'
        })
        res.status(200).json({
            code: 200,
            message: 'success',
            articles
        })
    } catch (error) {
        next(error)
    }
}

//处理文章图片
exports.handleImg = async (req, res, next) => {
    try {
        const form = formidable({ multiples: true, uploadDir: config.uploadDir, keepExtensions: true });
        // 获取协议（http或者https）
        const ht = req.protocol
        // 获取域名和端口号
        const host = req.headers.host
        form.parse(req, (err, fields, files) => {
            if (err) {
                return next(err)
            }

            let url = ht + "://" + host + '/uploads/' + files.files.newFilename
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

//处理文章封面
exports.handleCover = async (req, res, next) => {
    try {
        const form = formidable({ multiples: true, uploadDir: config.coverDir, keepExtensions: true });
        // 获取协议（http或者https）
        const ht = req.protocol
        // 获取域名和端口号
        const host = req.headers.host
        form.parse(req, (err, fields, files) => {
            if (err) {
                return next(err)
            }

            let url = 'covers/' + files.file.newFilename
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

//根据关键字搜索文章
exports.searchArticle = async (req, res, next) => {
    try {
        const inputInfo = req.body.inputInfo
        const query = new RegExp(inputInfo, 'i')
        const articles = await Article.find({
            $or: [{ title: { $regex: query } }, { description: { $regex: query } }]
        })
        res.status(200).json({
            code: 200,
            message: 'success',
            articles
        })
    } catch (error) {
        next(error)
    }
}

//修改文章
exports.updateArticle = async (req, res, next) => {
    try {
        const { articleId, articleBody } = req.body.article
        await Article.findByIdAndUpdate(articleId, articleBody)
        res.json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//删除文章
exports.deleteOneArticle = async (req, res, next) => {
    try {
        const articleId = req.body.articleId
        await Article.findByIdAndDelete(articleId)
        const user = await User.findById(req.user._id)
        user.articleCount -= 1
        await user.save()

        // await Article.deleteMany({
        //     article:articleId
        // })

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取文章类型
exports.getArticleType = async (req, res, next) => {
    try {

        const typeList = await ArticleType.find()

        res.status(200).json({
            code: 200,
            message: 'success',
            typeList
        })
    } catch (error) {
        next(error)
    }
}
