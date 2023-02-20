const { User, Captcha, Swiper, Article, Email, Birthday, ArticleCollection, ArticleCollectionItem } = require('../model')
const formidable = require('formidable')
const jwt = require('../util/jwt')
const { jwtSecret, avatarDir } = require('../config/config.default')
const md5 = require('../util/md5')
const createJwt = require('../util/createJwt')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')


//未完成
const geoip = require('geoip-lite')

//刷新token
exports.refreshToken = async (req, res, next) => {
    try {
        const user = req.user.toJSON()

        const access_token = await createJwt({ userId: user._id }, 60 * 60 * 24 * 2)

        const refresh_token = await createJwt({ userId: user._id }, 60 * 60 * 24 * 7)

        res.status(200).json({
            code: 200,
            access_token,
            refresh_token
        })
    } catch (error) {
        next(error)
    }
}

//ip属地
exports.getAddress = async (req, res, next) => {
    try {
        const ip = geoip.lookup('183.202.222.32')

        res.status(200).json({
            ip
        })
    } catch (error) {
        next(error)
    }
}

//用户登录
exports.login = async (req, res, next) => {
    try {
        const user = req.user.toJSON()

        const access_token = await createJwt({ userId: user._id }, 60 * 60 * 24 * 2)

        const refresh_token = await createJwt({ userId: user._id }, 60 * 60 * 24 * 7)

        delete user.password
        res.status(200).json({
            code: 200,
            ...user,
            access_token,
            refresh_token
        })
    } catch (error) {
        next(error)
    }
}

//邮箱验证码登录
exports.emailLogin = async (req, res, next) => {
    try {

        const myUser = req.body.user
        const user = await User.findOne({
            email: myUser.email
        })

        if (user) {
            await Captcha.findOne({
                email: myUser.email
            })
                .then(async (ret) => {
                    if (ret.captcha === myUser.captcha) {
                        const access_token = await createJwt({ userId: user._id }, 60 * 60 * 24 * 2)
                        const refresh_token = await createJwt({ userId: user._id }, 60 * 60 * 24 * 7)
                        delete user.password
                        res.status(200).json({
                            code: 200,
                            ...user,
                            access_token,
                            refresh_token
                        })
                    } else {
                        res.status(200).json({
                            code: 202,
                            message: '验证码无效'
                        })
                    }
                })
        }
    } catch (error) {
        next(error)
    }
}

//用户注册
exports.register = async (req, res, next) => {
    try {

        const email = req.body.user.email
        const captcha = await Captcha.findOne({
            email
        })
        if (captcha.captcha === req.body.user.captcha) {
            let user = new User({
                username: req.body.user.username,
                email,
                password: req.body.user.password
            })
            await user.save()
            user = user.toJSON()
            delete user.password
            return res.status(201).json({
                code: 200,
                data: user
            })
        }
        res.status(200).json({
            code: 201,
            message: '验证码无效!'
        })
    } catch (error) {
        next(error)
    }
}

//发送验证码
exports.sendCaptcha = async (req, res, next) => {
    try {
        let str = ''
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        for (let i = 0; i < 4; i++) {
            str += getRandomInt(10)
        }
        //发邮件
        const email = req.body.email

        await Captcha.deleteMany({
            email
        })

        let transport = nodemailer.createTransport(smtpTransport({
            host: 'smtp.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: '1497689258@qq.com',
                pass: 'bokmfrjphywpihfh'
            }
        }))
        transport.sendMail({
            from: '1497689258@qq.com',
            to: email,
            subject: '接口测试',
            html: `
            <p>你好！</p>
            <br>
            <p>你的验证码是:${str}</p>
            `
        }, function (err, data) {
            transport.close()
        })

        const captcha = new Captcha({
            email,
            captcha: str
        })
        await captcha.save()

        setTimeout(() => {
            captcha.remove()
        }, 300000)

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取登录用户
exports.getCurrentUser = async (req, res, next) => {
    try {

        res.status(200).json({
            code: 200,
            message: 'Success',
            data: req.user
        })
    } catch (error) {
        next(error)
    }
}

//获取指定用户信息
exports.getOneUser = async (req, res, next) => {
    try {
        const userId = req.params.userId
        const userInfo = await User.findById(userId)

        res.status(200).json({
            code: 200,
            message: 'success',
            userInfo
        })
    } catch (error) {
        next(error)
    }
}

//更新登录用户信息
exports.updateUserInfo = async (req, res, next) => {
    try {
        const user = req.user
        const userInfo = req.body.userInfo
        user.username = userInfo.username || user.username
        user.bio = userInfo.bio || user.bio
        user.gender = userInfo.gender || user.gender
        user.birthday = userInfo.birthday || user.birthday
        await user.save()
        let userBirthday = user.birthday.getMonth() + '/' + user.birthday.getDate()

        const birthday = await Birthday.findOne({
            user: user._id,
            email: user.email
        })
        if (birthday) {
            birthday.birthday = userBirthday
            await birthday.save()
        } else {
            const newBirthday = new Birthday({
                user: user._id,
                email: user.email,
                birthday: userBirthday
            })
            await newBirthday.save()
        }

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {

        next(error)
    }
}

//设置用户头像
exports.updateUserAvatar = async (req, res, next) => {
    try {
        const form = formidable({ multiples: true, uploadDir: avatarDir, keepExtensions: true });
        // 获取协议（http或者https）
        const ht = req.protocol
        // 获取域名和端口号
        const host = req.headers.host
        form.parse(req, async (err, fields, files) => {

            if (err) {
                return next(err)
            }
            let url = 'avatars/' + files.files.newFilename
            const user = req.user
            user.image = url
            await user.save()
            res.status(200).json({
                code: 200,
                message: 'success'
            })
        });
    } catch (error) {
        next(error)
    }
}

//获取轮播图
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

//轮播图点赞
exports.kudosTheSwiper = async (req, res, next) => {
    try {

        const swiperId = req.body.swiperId

        const swiper = await Swiper.findById(swiperId)

        swiper.clickCount += 1

        await swiper.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取推荐文章
exports.getRecommendArticle = async (req, res, next) => {
    try {

        const articleList = await Article.find({
            isAudit: true,
            status: 0,
            isRecommend: true
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            articleList
        })
    } catch (error) {
        next(error)
    }
}

//修改密码
exports.updatePassword = async (req, res, next) => {
    try {

        const prePassword = req.body.prePassword
        const newPassword = req.body.newPassword

        const userId = req.user._id

        const user = await User.findById(userId).select(['password'])

        if (md5(prePassword) === user.password) {
            if (prePassword === newPassword) {
                return res.status(200).json({
                    code: 202,
                    message: '原密码和新密码相同，你在赣神魔？'
                })
            } else {
                user.password = newPassword
                await user.save()
            }
        } else {
            return res.status(200).json({
                code: 201,
                message: '原密码错误'
            })
        }

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//邮箱修改密码
exports.updatePasswordByEmail = async (req, res, next) => {
    try {

        const newPassword = req.body.newPassword
        const captcha = req.body.captcha

        const user = await User.findById(req.user._id).select(['password', 'email'])

        const retCaptcha = await Captcha.findOne({
            email: user.email
        })

        if (retCaptcha && retCaptcha.captcha === captcha) {
            user.password = newPassword
            await user.save()
        } else {
            return res.status(200).json({
                code: 201,
                message: '验证码错误'
            })
        }

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//修改密码邮箱验证码
exports.sendUpdatePasswordCaptcha = async (req, res, next) => {
    try {
        let str = ''
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        for (let i = 0; i < 4; i++) {
            str += getRandomInt(10)
        }

        const user = await User.findById(req.user._id)
        const email = user.email
        await Captcha.deleteMany({
            email
        })

        let transport = nodemailer.createTransport(smtpTransport({
            host: 'smtp.qq.com',
            port: 465,
            secure: true,
            auth: {
                user: '1497689258@qq.com',
                pass: 'bokmfrjphywpihfh'
            }
        }))
        transport.sendMail({
            from: '1497689258@qq.com',
            to: email,
            subject: '接口测试',
            html: `
            <p>你好！</p>
            <br>
            <p>你的验证码是:${str}</p>
            `
        }, function (err, data) {
            transport.close()
        })

        const captcha = new Captcha({
            email,
            captcha: str
        })
        await captcha.save()

        setTimeout(() => {
            captcha.remove()
        }, 300000)

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//添加邮箱
exports.addEmail = async (req, res, next) => {
    try {

        const newEmail = req.body.email
        const captcha = req.body.captcha

        const user = await User.findById(req.user._id)
        const retCaptcha = await Captcha.findOne({
            email: user.email
        })
        if (retCaptcha && retCaptcha.captcha === captcha) {
            const email = await Email.findOne({
                user: user._id
            })
            if (email) {
                if (!email.emailList.includes(newEmail)) {
                    email.emailList.push(newEmail)
                    await email.save()
                } else {
                    return res.status(200).json({
                        code: 201,
                        message: '当前邮箱已经添加过了~'
                    })
                }
            } else {
                await new Email({
                    emailList: [newEmail],
                    user: user._id
                }).save()
            }
        } else {
            return res.status(200).json({
                code: 201,
                message: '验证码错误'
            })
        }

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取邮箱列表
exports.getEmailList = async (req, res, next) => {
    try {

        const user = req.user._id

        const email = await Email.findOne({
            user
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            email
        })
    } catch (error) {
        next(error)
    }
}

//更新备用邮箱
exports.updateSpareEmail = async (req, res, next) => {
    try {

        const spareEmail = req.body.spareEmail

        const emailCollection = await Email.findOne({
            user: req.user._id
        })

        emailCollection.spareEmail = spareEmail

        await emailCollection.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//创建合集
exports.createTheArticleCollection = async (req, res, next) => {
    try {

        const collection = new ArticleCollection(req.body.collection)

        const user = req.user._id

        const ret = await ArticleCollection.findOne({
            user,
            title: collection.title
        })

        if (ret) {
            return res.status(200).json({
                code: 201,
                message: '该合集已存在'
            })
        }

        collection.user = user

        await collection.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取合集
exports.getArticleCollection = async (req, res, next) => {
    try {

        const user = req.user._id

        const collectionList = await ArticleCollection.find({
            user
        }).populate('articleList')

        res.status(200).json({
            code: 200,
            message: 'success',
            collectionList
        })
    } catch (error) {
        next(error)
    }
}

//获取合集
exports.getOneArticleCollection = async (req, res, next) => {
    try {

        const collectionId = req.body.collectionId

        const collection = await ArticleCollection.findById(collectionId)
            .populate('articleList')

        res.status(200).json({
            code: 200,
            message: 'success',
            collection
        })
    } catch (error) {
        next(error)
    }
}

//获取合集未包含文章
exports.getCollectionArticleList = async (req, res, next) => {
    try {

        const collectionId = req.body.collectionId

        const collection = await ArticleCollection.findById(collectionId)

        const articleArr = collection.articleList

        const articleList = await Article.find({
            author: req.user._id
        })


        if (articleArr.length > 0) {
            for (const i in articleArr) {
                for (const j in articleList) {
                    if (articleArr[i].toString() === articleList[j]._id.toString()) {
                        articleList.splice(j, 1)
                    }
                }
            }
        }


        res.status(200).json({
            code: 200,
            message: 'success',
            articleList
        })
    } catch (error) {
        next(error)
    }
}

//添加文章到合集
exports.addArticleToCollection = async (req, res, next) => {
    try {

        const articleId = req.body.articleId

        const collectionId = req.body.collectionId

        const collection = await ArticleCollection.findById(collectionId)

        collection.articleList.push(articleId)

        const articleCollectionItem = new ArticleCollectionItem({
            user: req.user._id,
            article: articleId,
            articleCollection: collectionId
        })

        await articleCollectionItem.save()

        await collection.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//删除集合文章
exports.deleteArticleOfCollection = async (req, res, next) => {
    try {

        const articleId = req.body.articleId

        const collectionId = req.body.collectionId

        await ArticleCollectionItem.deleteOne({
            user: req.user._id,
            article: articleId,
            articleCollection: collectionId
        })

        const collection = await ArticleCollection.findById(collectionId)

        for (const i in collection.articleList) {
            if (collection.articleList[i].toString() === articleId.toString()) {
                collection.articleList.splice(i, 1)
            }
        }

        await collection.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//更新合集
exports.updateTheCollection = async (req, res, next) => {
    try {

        const collectionId = req.body.collectionId

        const title = req.body.title

        const keyWord = req.body.keyWord

        const collection = await ArticleCollection.findById(collectionId)

        collection.title = title

        collection.keyWord = keyWord

        await collection.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//更新合集
exports.deleteTheCollection = async (req, res, next) => {
    try {

        const collectionId = req.body.collectionId

        await ArticleCollectionItem.deleteMany({
            user: req.user._id,
            articleCollection: collectionId
        })

        await ArticleCollection.findByIdAndDelete(collectionId)

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}


//获取文章合集
exports.getArticleOfCollection = async (req, res, next) => {
    try {

        const articleId = req.body.articleId

        const article = await Article.findById(articleId)

        const collectionItem = await ArticleCollectionItem.findOne({
            user: article.author,
            article: article._id
        })

        if (collectionItem) {
            const collectionId = collectionItem.articleCollection
            const collection = await ArticleCollection.findById(collectionId)
                .populate('articleList')
            return res.status(200).json({
                code: 200,
                message: 'success',
                collection
            })
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
