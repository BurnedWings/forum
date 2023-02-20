const { Collection, UserCollection, CollectionItem } = require('../model')

//用户创建收藏夹
exports.createCollection = async (req, res, next) => {
    try {

        req.body.collection.user = req.user._id

        const ret = await Collection.findOne({
            user: req.user._id,
            collectionName: req.body.collection.collectionName,
            userCollection: req.body.collection.userCollection
        })
        if (ret) {
            return res.status(202).json({
                code: 202,
                message: '此文件夹已存在!'
            })
        }

        const collection = new Collection(req.body.collection)

        const userCollectionId = collection.userCollection

        await UserCollection.updateOne({
            _id: userCollectionId
        }, {
            $push: {
                collectionList: collection._id
            }
        })

        await collection.save()

        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        next(error)
    }
}

//用户删除收藏夹
exports.deleteCollection = async (req, res, next) => {
    try {

        const collectionId = req.params.collectionId

        const collection = await Collection.findByIdAndDelete(collectionId)

        const userCollection =  await UserCollection.findById(collection.userCollection)
        
        await CollectionItem.deleteMany({
            ofCollection:collectionId
        })

        const listArr = userCollection.collectionList
        for (const i in listArr) {
            if(collectionId===listArr[i].toString()){
                listArr.splice(i,1)
                await userCollection.save()
            }
        }

        res.status(200).json({
            code: 200,
            message: 'success'
        })

    } catch (error) {
        next(error)
    }
}

//获取收藏夹列表
exports.getCollectionList = async (req, res, next) => {
    try {

        const userId = req.user._id
        const collection = await UserCollection.findOne({
            user: userId
        }).populate('collectionList')

        const collectionArr = collection.collectionList

        const articleId = req.body.articleId
        let arr = []
        if (articleId) {
            collectionArr.forEach(async (item) => {
                await CollectionItem.findOne({
                    article: articleId,
                    ofCollection: item._id
                }).then((ret) => {
                    if (ret != null) {
                        arr.push(1)
                    } else {
                        arr.push(0)
                    }
                })
                if (arr.length === collectionArr.length) {
                    return res.status(200).json({
                        code: 200,
                        message: 'success',
                        userCollectionId: collection._id,
                        collectionList: collection.collectionList,
                        arr
                    })
                }
            });
        } else {
            res.status(200).json({
                code: 200,
                message: 'success',
                userCollectionId: collection._id,
                collectionList: collection.collectionList
            })
        }

    } catch (error) {
        next(error)
    }
}

//获取单个收藏夹所有文章
exports.getArticle = async (req, res, next) => {
    try {

        const pageSize = 5

        const page = req.body.page
        if (page === null) {
            page = 1
        }

        const collectionId = req.params.collectionId

        const total = await CollectionItem.find({
            ofCollection: collectionId
        }).count()

        const articleList = await CollectionItem.find({
            ofCollection: collectionId
        }).populate('article')
            .limit(5)
            .skip((page - 1) * pageSize)

        res.status(200).json({
            code: 200,
            message: 'success',
            articleList,
            total
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

//修改收藏夹名称
exports.updateCollectionName = async (req, res, next) => {
    try {

        const collection = req.body.collection

        await Collection.findByIdAndUpdate(collection.collectionId, {
            $set: {
                collectionName: collection.collectionName
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

//移除作者删除文章
exports.removeArticleWitchDeleted = async (req,res,next) => {
    try {

        const collectionItemId = req.body.collectionItemId

        const collectionItem = await CollectionItem.findById(collectionItemId)

        const collection = await Collection.findById(collectionItem.ofCollection)

        collection.articleCount -= 1

        await collection.save()

        await collectionItem.remove()

        res.status(200).json({
            code: 200,
            message: 'success'
        })
    } catch (error) {
        next(error)
    }
}

//获取收藏状态
exports.getCollectionStatus = async (req, res, next) => {
    try {

        const article = req.params.articleId
        const user = req.user._id

        const ret = await CollectionItem.findOne({
            article,
            user
        })

        let isCollection = false

        if (ret) {
            isCollection = true
        }

        res.status(200).json({
            code: 200,
            message: 'success',
            isCollection
        })

    } catch (error) {
        next(error)
    }
}

//移动收藏文章到指定文件夹
exports.removeArticleTo = async (req, res, next) => {
    try {

        const myCollection = req.body.collection
        myCollection.user = req.user._id

        const targetCollection = myCollection.targetCollection
        delete myCollection.targetCollection


        const ret = await CollectionItem.findOne({
            ...myCollection
        })
        ret.ofCollection=targetCollection
        await ret.save()
        const myTargetCollection = await Collection.findOne({
            _id:targetCollection
        })
        const targetCollectionArticleCount = myTargetCollection.articleCount + 1
        myTargetCollection.articleCount = targetCollectionArticleCount
        myTargetCollection.save()

        const ofCollection = myCollection.ofCollection
        const collection = await Collection.findOne({
            _id:ofCollection
        })
        const newArticleCount = collection.articleCount - 1

        collection.articleCount = newArticleCount
        await collection.save()


        res.status(200).json({
            code: 200,
            message: 'success'
        })


    } catch (error) {
        next(error)
    }
}