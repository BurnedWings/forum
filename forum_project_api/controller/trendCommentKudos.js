const { TrendComment,TrendCommentKudos } = require('../model')


//评论点赞
exports.kudos = async (req, res, next) => {
    try {

        const myTrendCommentKudos = req.body.trendCommentKudos
        myTrendCommentKudos.user = req.user._id
        console.log(myTrendCommentKudos)

        const ret = await TrendCommentKudos.findOne({
            trendComment: myTrendCommentKudos.trendComment,
            ofUser:myTrendCommentKudos.ofUser,
            user:myTrendCommentKudos.user
        })
        if (ret) {
            const comment = await TrendComment.findById(myTrendCommentKudos.trendComment)
            comment.favoritesCount -= 1
            await comment.save()
            await ret.remove()
        } else {
            const commentKudos = new TrendCommentKudos(myTrendCommentKudos)
            await commentKudos.save()
            const commentId = commentKudos.trendComment
            const comment = await TrendComment.findOne({
                _id: commentId
            })
            comment.favoritesCount += 1
            await comment.save()
        }


        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}
