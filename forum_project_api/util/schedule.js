const schedule = require('node-schedule')
const { User, Forbid, Birthday, Article, Trend } = require('../model')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

exports.sendBirthdayEmail = () => {
    return schedule.scheduleJob('birthday', '10 0 0 * * *', async () => {

        const nowDate = new Date()

        let date = nowDate.getMonth() + '/' + nowDate.getDate()

        const userList = await Birthday.find({
            birthday: date
        })

        for (const i in userList) {
            //发邮件
            const email = userList[i].email

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
                subject: '生日祝福',
                html: `
                <p>你好！</p>
                <br>
                <p>生日快乐</p>
                `
            }, function (err, data) {
                transport.close()
            })
        }
    })
}

exports.clearForbid = () => {
    return schedule.scheduleJob('clearForbid', '10 1 1 * * *', async () => {
        //当天
        var Date0 = new Date();

        //前七天
        var Date1 = new Date(Date0.getTime() - 168 * 60 * 60 * 1000)

        const forbidList = await Forbid.find({
            createdAt: {
                $lt: Date1
            }
        })
        for (const i in forbidList) {
            const userId = forbidList[i].user
            const user = await User.findById(userId)
            user.violateCount = 0
            user.status = 0
            await user.save()
            await forbidList[i].remove()
        }

    })
}

exports.clearOverdueArticle = () => {
    return schedule.scheduleJob('clearOverdueArticle', '10 2 2 * * *', async () => {
        //当天
        var Date0 = new Date();

        //前七天
        var Date1 = new Date(Date0.getTime() - 168 * 60 * 60 * 1000)

        const articleList = await Article.find({
            updatedAt: {
                $lt: Date1
            },
            status:1
        })
        for (const i in articleList) {
           await articleList[i].remove()
        }
    })
}

exports.clearOverdueTrend = () => {
    return schedule.scheduleJob('clearOverdueTrend', '10 3 3 * * *', async () => {
        //当天
        var Date0 = new Date();

        //前七天
        var Date1 = new Date(Date0.getTime() - 168 * 60 * 60 * 1000)

        const trendList = await Trend.find({
            updatedAt: {
                $lt: Date1
            },
            status:1
        })
        for (const i in trendList) {
           await trendList[i].remove()
        }
    })
}









