const jwt = require('./jwt')
const { jwtSecret } = require('../config/config.default')

module.exports = async (data, limit) => {
    const ret = await jwt.sign(data, jwtSecret, {
        expiresIn: limit
    })
    return ret
}

