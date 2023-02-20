const { User, Fans } = require('../model')

//关注
exports.concernOneUser = async (req, res, next) => {
    try {

        const fans = req.body.fans
        fans.user = req.user._id
        if (fans.ofUser === fans.user.toString()) {
            return res.status(203).json({
                code: 203,
                message: '不能关注自己哦~'
            })
        }
        const ofUser = await User.findById(fans.ofUser)
        const ret = await Fans.findOne(fans)
        const user = await User.findById(req.user._id)
        if (ret) {
            await ret.remove()
            ofUser.fansCount -= 1
            user.concernsCount -= 1
            await user.save()
            await ofUser.save()
            return res.status(200).json({
                code: 202,
                message: 'success'
            })
        } else {
            const newFans = new Fans(fans)
            await newFans.save()
            ofUser.fansCount += 1
            user.concernsCount += 1
            await user.save()
            await ofUser.save()
            return res.status(200).json({
                code: 200,
                message: 'success'
            })
        }

    } catch (error) {
        next(error)
    }
}

//取消关注
exports.cancelConcern = async (req, res, next) => {
    try {

        const fans = req.body.fans
        fans.user = req.user._id
        const ofUser = await User.findById(fans.ofUser)
        const ret = await Fans.findOne(fans)
        await ret.remove()
        ofUser.fansCount -= 1
        await ofUser.save()
        res.status(200).json({
            code: 200,
            message: 'success'
        })


    } catch (error) {
        next(error)
    }
}

//获取关注状态
exports.getConcernStatus = async (req, res, next) => {
    try {

        const ofUser = req.body.ofUser
        const user = req.user._id

        const ret = await Fans.findOne({
            user,
            ofUser
        })
        let isConcern = false
        if (ret) {
            isConcern = true
        }

        res.status(200).json({
            code: 200,
            message: 'success',
            isConcern
        })
    } catch (error) {
        next(error)
    }
}

//获取用户关注列表
exports.getConcernList = async (req, res, next) => {
    try {
        const user = req.body.user

        const concernCount = await Fans.count({
            user
        })

        const concernList = await Fans.find({
            user
        }).populate('ofUser')
            .sort({
                createdAt: 'desc'
            })

        const concernArr = []
        concernList.forEach(item => {
            const user = {}
            user._id = item.ofUser._id
            user.username = item.ofUser.username
            user.image = item.ofUser.image
            user.bio = item.ofUser.bio
            concernArr.push(user)
        })



        res.status(200).json({
            code: 200,
            message: 'success',
            concernList: concernArr,
            concernCount
        })
    } catch (error) {
        next(error)
    }
}


//获取用户粉丝列表
exports.getFansList = async (req, res, next) => {
    try {
        const user = req.body.user

        const fansCount = await Fans.count({
            ofUser:user
        })

        const fansList = await Fans.find({
            ofUser: user
        }).populate('user')
            .sort({
                createdAt: 'desc'
            })

        const fansArr = []
        fansList.forEach(item => {
            const user = {}
            user._id = item.user._id
            user.username = item.user.username
            user.image = item.user.image
            user.bio = item.user.bio
            fansArr.push(user)
        })

        res.status(200).json({
            code: 200,
            message: 'success',
            fansList: fansArr,
            fansCount
        })

    } catch (error) {
        next(error)
    }
}



