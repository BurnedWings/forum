const { UserCollection , Collection } = require('../model')

//创建用户收藏夹表
exports.createUserCollectionTable = async (req, res, next) => {
    try {

        const myUserCollection = req.body.userCollection
        console.log(req.body.userCollection)

        //创建用户收藏夹表
        const collectionTable =  new UserCollection(myUserCollection)
        await collectionTable.save()

        //创建默认收藏夹
        const collection = {
            user:myUserCollection.user,
            collectionName:'默认收藏夹',
            userCollection:collectionTable._id
        }

        const myCollection = new Collection(collection)
        await myCollection.save()

        await UserCollection.updateOne({
            _id:collectionTable._id
        },{
            $push:{
                collectionList:myCollection._id
            }
        })

        
        res.status(200).json({
            code: 200,
            message: 'success',
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
