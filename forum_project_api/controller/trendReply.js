const { TrendReply, TrendComment, Trend , TrendCommentKudos, TrendKudos,TrendReplyKudos } = require('../model')

//创建回复
exports.createReply = async (req, res, next) => {
    try {
        const reply = new TrendReply(req.body.reply)

        await reply.save()
        const ret = await TrendComment.updateOne({
            _id:reply.trendComment
        },{
            $push:{
                replyList:reply._id
            }
        })
        const trend = await Trend.findById(reply.trend)
        const myCommentsCount = trend.commentsCount + 1
        await Trend.findByIdAndUpdate(trend._id, {
            $set:{
                commentsCount:myCommentsCount
            }
        })


        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}



//删除回复
exports.deleteReply = async (req, res, next) => {
    try {
        
        const replyId = req.body.reply
        const reply = await TrendReply.findById(replyId)
        const commentId = reply.trendComment
        const trendId = reply.trend
        
        const comment = await TrendComment.findById(commentId)
        const trend = await Trend.findById(trendId)
        const replyList = comment.replyList
        let targetIndex 
        for (const i in replyList) {
            if(replyId===replyList[i].toString()){
                targetIndex = i
            }     
        }
        comment.replyList.splice(targetIndex,1)

        await TrendReplyKudos.deleteMany({
            trendReply:replyId
        })
        await comment.save()
        trend.commentsCount -= 1
        await trend.save()
        await reply.remove()
        

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}