const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const { User } = require('../model/index')

module.exports = async (req, res, next) => {

    let refToken = req.headers.refreshtoken
    
    if (!refToken) {
        return res.status(401).end()
    }

    try {
        const decodedToken = await verify(refToken, jwtSecret)
        req.user = await User.findById(decodedToken.userId)
        next()
    } catch (error) {
        return res.status(209).end()
    }
    
}