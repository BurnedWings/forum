const { Collection, UserCollection, CollectionItem } = require('../model')

//用户收藏文章
exports.collection = async (req, res, next) => {
    try {

        const articleCollection = req.body.collection
        articleCollection.user = req.user._id

        const ret = await CollectionItem.findOne({
            article: articleCollection.article,
            ofCollection: articleCollection.ofCollection,
            user: articleCollection.user
        })
        if (ret) {
            await ret.deleteOne()
            const collection = await Collection.findById(articleCollection.ofCollection)
            let newArticleCount = collection.articleCount - 1
            collection.articleCount = newArticleCount
            await collection.save()

        } else {
            const item = new CollectionItem(articleCollection)

            const collection = await Collection.findById(item.ofCollection)

            const newArticleCount = collection.articleCount + 1

            collection.articleCount = newArticleCount
            await collection.save()

            await item.save()
        }



        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//用户移除收藏夹单个文章
exports.cancelCollection = async (req, res, next) => {
    try {

        const articleCollection = req.body.collection
        articleCollection.user = req.user._id
        console.log(articleCollection)

        const ret = await CollectionItem.findOne({
            article: articleCollection.article,
            ofCollection: articleCollection.ofCollection,
            user: articleCollection.user
        })
        console.log(ret)

        await ret.deleteOne()
        const collection = await Collection.findById(articleCollection.ofCollection)
        let newArticleCount = collection.articleCount - 1
        collection.articleCount = newArticleCount
        await collection.save()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
