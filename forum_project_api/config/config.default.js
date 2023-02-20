const path = require('path')
module.exports = {
    dbUrl: 'mongodb://localhost/forum',
    jwtSecret: 'd8540db1-169b-48df-a116-e23e7bad6189',
    uploadDir: path.join(__dirname, '../public/uploads'),
    avatarDir: path.join(__dirname, '../public/avatars'),
    coverDir: path.join(__dirname, '../public/covers'),
    trendDir: path.join(__dirname, '../public/trends'),
    noticeDir: path.join(__dirname, '../public/notices'),
    swiperDir: path.join(__dirname, '../public/swipers')
}