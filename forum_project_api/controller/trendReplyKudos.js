const { TrendReply, TrendReplyKudos } = require('../model')


//回复点赞
exports.kudos = async (req, res, next) => {
    try {

        const myReplyKudos = req.body.trendReplyKudos
        myReplyKudos.user = req.user._id

        let cancel = null

        const ret = await TrendReplyKudos.findOne({
            trendReply: myReplyKudos.trendReply,
            ofUser: myReplyKudos.ofUser,
            user: myReplyKudos.user
        })
        if (ret) {
            cancel = true
            const reply = await TrendReply.findById(myReplyKudos.trendReply)

            reply.favoritesCount -= 1

            await reply.save()
            await ret.remove()
        } else {
            const replyKudos = new TrendReplyKudos(myReplyKudos)
            await replyKudos.save()
            const replyId = replyKudos.trendReply
            const reply = await TrendReply.findOne({
                _id: replyId
            })
            reply.favoritesCount += 1
            await reply.save()

        }

        res.status(200).json({
            code: 200,
            message: 'success',
            cancel
        })
    } catch (error) {
        next(error)
    }
}
