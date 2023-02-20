const { Article, ArticleKudos, User, Fans, Trend } = require('../model')
const config = require('../config/config.default')
const formidable = require('formidable')

//查询关注作者文章
exports.getTrendArticle = async (req, res, next) => {
    try {
        const userId = req.user._id
        const concernList = await Fans.find({
            user: userId
        })
        if (concernList) {
            let articleList = []
            for (const i in concernList) {
                await Article.find({
                    author: concernList[i].ofUser,
                    isAudit: true,
                    status: 0
                })
                    .populate({
                        path: 'author',
                        select: '_id username image'
                    })
                    .then((ret) => {
                        articleList.push(...ret)
                    })
                if (concernList.length === parseInt(i) + 1) {
                    articleList.sort((preObj, nextObj) => {
                        if (preObj.createdAt < nextObj.createdAt) return 1
                        else if (preObj.createdAt > nextObj.createdAt) return -1
                        else return 0
                    })
                    res.status(200).json({
                        code: 200,
                        message: 'success',
                        articleList
                    })
                }
            }
        } else {
            res.status(200).json({
                code: 202,
                message: 'success',

            })
        }
    } catch (error) {
        next(error)
    }
}

//创建动态
exports.createTrend = async (req, res, next) => {
    try {
        const userId = req.user._id
        // const user = await User.findById(userId)
        // user.trendsCount += 1
        // await user.save()
        req.body.trend.user = userId
        const trend = new Trend(req.body.trend)
        const trendId = trend._id
        await trend.save()

        res.status(200).json({
            code: 200,
            message: 'success',
            trendId
        })
    } catch (error) {
        next(error)
    }

}

//处理动态图片
exports.handleTrendImg = async (req, res, next) => {
    try {
        const trendId = req.params.trendId
        const form = formidable({ multiples: true, uploadDir: config.trendDir, keepExtensions: true });
        // 获取协议（http或者https）
        const ht = req.protocol
        // 获取域名和端口号
        const host = req.headers.host
        let arr = []
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return next(err)
            }
            if (files.file.length === undefined) {
                let url = 'trends/' + files.file.newFilename
                await Trend.findByIdAndUpdate(trendId, {
                    $push: {
                        image: url
                    }
                })
                res.status(200).json({
                    code: 200,
                    message: 'success'
                })
            } else {
                for (const i in files.file) {
                    let url = 'trends/' + files.file[i].newFilename
                    arr.push(url)
                    if (files.file.length === parseInt(i) + 1) {
                        const trend = await Trend.findById(trendId)
                        trend.image = arr
                        await trend.save()
                        res.status(200).json({
                            code: 200,
                            message: 'success'
                        })
                    }
                }
            }
        });
    } catch (error) {
        next(error)
    }
}

//查询关注用户动态
exports.getConcernTrend = async (req, res, next) => {
    try {
        const userId = req.user._id

        const concernList = await Fans.find({
            user: userId
        })
        if (concernList) {
            let trendList = []
            for (const i in concernList) {
                await Trend.find({
                    user: concernList[i].ofUser,
                    isAudit: true,
                    status: 0
                })
                    .populate({
                        path: 'user',
                        select: '_id username image'
                    })
                    .then((ret) => {
                        trendList.push(...ret)
                    })
                if (concernList.length === parseInt(i) + 1) {
                    res.status(200).json({
                        code: 200,
                        message: 'success',
                        trendList
                    })
                }
            }
        } else {
            res.status(200).json({
                code: 202,
                message: 'success',

            })
        }
    } catch (error) {
        next(error)
    }

}

//查询动态详情
exports.getDetailTrend = async (req, res, next) => {
    try {

        const trendId = req.params.trendId
        const trend = await Trend.findById(trendId)
            .populate({
                path: 'user',
                select: '_id username image'
            })

        let timer = {}
        //清除定时器
        clearTimeout(timer)
        const clicksCount = trend.clicksCount + 1

        //开启定时器
        timer = setTimeout(async () => {
            await Trend.findByIdAndUpdate(trendId, {
                clicksCount
            })
        }, 30000)

        res.status(200).json({
            code: 200,
            message: 'success',
            trend
        })


    } catch (error) {
        next(error)
    }

}

//查询个人动态
exports.getOnwTrend = async (req, res, next) => {
    try {

        const user = req.params.userId
        const trendList = await Trend.find({
            user,
            isAudit: true,
            status: 0
        }).populate({
            path: 'user',
            select: '_id username image'
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            trendList
        })
    } catch (error) {
        next(error)
    }
}

//删除动态
exports.deleteOwnTrend = async (req, res, next) => {
    try {

        const trendId = req.body.trend
        const userId = req.user._id

        const trend = await Trend.findOne({
            _id: trendId,
            user: userId
        })
        await trend.remove()
        const user = await User.findById(userId)
        user.trendsCount -= 1
        await user.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

