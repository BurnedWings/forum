const mongoose = require('mongoose')
const md5 = require('../util/md5')
const baseModel = require('./base-model')

var swiperSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: null
    },
    clickCount: {
        type: Number,
        default: 0
    },
    ...baseModel
});

module.exports = swiperSchema