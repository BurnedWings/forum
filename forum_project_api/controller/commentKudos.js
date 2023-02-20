const { Comment, CommentKudos } = require('../model')


//评论点赞
exports.kudos = async (req, res, next) => {
    try {

        const myCommentKudos = req.body.commentKudos
        myCommentKudos.user = req.user._id


        const ret = await CommentKudos.findOne({
            comment: myCommentKudos.comment,
            ofUser:myCommentKudos.ofUser,
            user:myCommentKudos.user
        })
        if (ret) {
            const comment = await Comment.findById(myCommentKudos.comment)
            comment.favoritesCount -= 1
            await comment.save()
            await ret.remove()
        } else {
            const commentKudos = new CommentKudos(myCommentKudos)
            await commentKudos.save()
            const commentId = commentKudos.comment
            const comment = await Comment.findOne({
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
