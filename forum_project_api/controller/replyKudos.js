const { Reply,ReplyKudos} = require('../model')


//评论点赞
exports.kudos = async (req, res, next) => {
    try {
      
        const myReplyKudos = req.body.replyKudos
        myReplyKudos.user = req.user._id


        const ret = await ReplyKudos.findOne({
            reply: myReplyKudos.reply,
            ofUser:myReplyKudos.ofUser,
            user:myReplyKudos.user
        })

        let cancel = null
        if (ret) {
            cancel = true
            const reply = await Reply.findById(myReplyKudos.reply)
            reply.favoritesCount -= 1
            await reply.save()
            await ret.remove()
        } else {
            const replyKudos = new ReplyKudos(myReplyKudos)
            await replyKudos.save()
            const replyId = replyKudos.reply
            const reply = await Reply.findOne({
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
