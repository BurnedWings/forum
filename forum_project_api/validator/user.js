const validate = require('../middleware/validate')
const { User } = require('../model/index')
const md5 = require('../util/md5')
const { body } = require('express-validator');

exports.register = validate([
    body('user.username')
        .custom(async (username,{req,res}) => {
            const user = await User.findOne({ username })
            if (user) {
                return Promise.reject('用户名已存在')
            }
        }),
    body('user.email')
        .custom(async (email,{req,res}) => {
            const user = await User.findOne({ email })
            if (user) {
                return Promise.reject('邮箱已存在')
            }
        })
])

exports.login = [
    validate([
        body('user.email').custom(async (email, { req,res }) => {
            const user = await User.findOne({ email })
                .select(['password', 'email', 'username', 'bio', 'image'])
            if (!user) {
                return Promise.reject('用户不存在')
            }

            //将数据挂载到请求对象中，后面可以使用
            req.user = user
        })
    ]),
    validate([
        body('user.password').custom(async (password, { req,res }) => {
            if (md5(password) !== req.user.password) {
                return Promise.reject('密码错误')
            }
        })
    ])
]