const { verify } = require('../util/jwt')
const { jwtSecret } = require('../config/config.default')
const { Admin } = require('../model/index')

module.exports = async (req, res, next) => {

    let refToken = req.headers.refreshtoken
    
    if (!refToken) {
        return res.status(401).end()
    }

    try {
        const decodedToken = await verify(refToken, jwtSecret)
        req.user = await Admin.findById(decodedToken.userId)
        next()
    } catch (error) {
        return res.status(209).end()
    }
    
}