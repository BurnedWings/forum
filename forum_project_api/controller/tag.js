//标签
exports.getTags = async (req, res, next) => {
    try {
        //处理请求
        res.send('get /')
    } catch (error) {
        next(error)
    }
}