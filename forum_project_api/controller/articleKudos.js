const { ArticleKudos, Article } = require('../model')

//获取点赞状态
exports.getKudosStatus = async (req, res, next)=>{
    try {
        const {article,user} = req.body.articleKudos
        let isKudos = false
        const ret = await ArticleKudos.findOne({
            article,
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

        const articleKudos = req.body.articleKudos

        const ret = await ArticleKudos.findOne({
            article: articleKudos.article,
            user: articleKudos.user,
            ofUser: articleKudos.ofUser
        })
        const article = await Article.findById(articleKudos.article)
        if (ret === null) {
            const newArticleKudos = new ArticleKudos(req.body.articleKudos)
            await newArticleKudos.save()
            const favoritesCount = article.favoritesCount + 1
            await Article.findByIdAndUpdate(articleKudos.article, {
                favoritesCount
            })
        } else {
            await ArticleKudos.findByIdAndDelete(ret._id)
            const favoritesCount = article.favoritesCount-1
            await Article.findByIdAndUpdate(articleKudos.article, {
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

