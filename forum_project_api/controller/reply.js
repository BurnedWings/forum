const { Reply, ReplyKudos } = require('../model')
const { Comment } = require('../model')
const { Article } = require('../model')

//创建回复
exports.createReply = async (req, res, next) => {
    try {
        const reply = new Reply(req.body.reply)
        await reply.save()
        const ret = await Comment.updateOne({
            _id:reply.comment
        },{
            $push:{
                replyList:reply._id
            }
        })
        const article = await Article.findById(reply.article)
        const myCommentsCount = article.commentsCount + 1
        await Article.findByIdAndUpdate(article._id, {
            $set:{
                commentsCount:myCommentsCount
            }
        })


        res.status(200).json({
            code: 200,
            message: 'success',
            reply
        })
    } catch (error) {
        next(error)
    }
}

//删除回复
exports.deleteReply = async (req, res, next) => {
    try {
        
        const replyId = req.body.reply
        const reply = await Reply.findById(replyId)
        const commentId = reply.comment
        const articleId = reply.article
        
        const comment = await Comment.findById(commentId)
        const article = await Article.findById(articleId)
        const replyList = comment.replyList
        let targetIndex 
        for (const i in replyList) {
            if(replyId===replyList[i].toString()){
                targetIndex = i
            }     
        }
        comment.replyList.splice(targetIndex,1)

        await ReplyKudos.deleteMany({
            reply:replyId
        })
        await comment.save()
        article.commentsCount -= 1
        await article.save()
        await reply.remove()
        

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}