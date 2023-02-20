const { Trend , TrendKudos} = require('../model')

//获取点赞状态
exports.getKudosStatus = async (req, res, next)=>{
    try {
        const {trend} = req.body.trendKudos
        const user = req.user._id
        let isKudos = false
        const ret = await TrendKudos.findOne({
            trend,
            user
        })
        if(ret){
            isKudos=true
        }
        res.status(200).json({
            code: 200,
            message: 'success',
            isKudos
        })
        
    } catch (error) {
        next(error)
    }
}

//点赞
exports.kudos = async (req, res, next) => {
    try {

        const trendKudos = req.body.trendKudos

        const ret = await TrendKudos.findOne({
            trend: trendKudos.trend,
            user: trendKudos.user,
            ofUser: trendKudos.ofUser
        })

        const trend = await Trend.findById(trendKudos.trend)
        if (ret === null) {
            const newTrendKudos = new TrendKudos(req.body.trendKudos)
            await newTrendKudos.save()
            const favoritesCount = trend.favoritesCount + 1
            await Trend.findByIdAndUpdate(trendKudos.trend, {
                favoritesCount
            })
        } else {
            await TrendKudos.findByIdAndDelete(ret._id)
            const favoritesCount = trend.favoritesCount-1
            await Trend.findByIdAndUpdate(trendKudos.trend, {
                favoritesCount
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

