const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendCommentsSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    trend: {
        type: Schema.Types.ObjectId,
        ref: 'Trend'
    },
    body: {
        type: String,
        required: true
    },
    replyList: {
        type: [Schema.Types.ObjectId],
        ref: 'TrendReply'
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    ...baseModel
});

module.exports = trendCommentsSchema