const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendReplySchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    trend: {
        type: Schema.Types.ObjectId,
        ref: 'Trend'
    },
    trendComment: {
        type: Schema.Types.ObjectId,
        ref: 'TrendComment'
    },
    body: {
        type: String,
        required: true
    },
    toReplyId: {
        type: Schema.Types.ObjectId,
        ref: 'TrendReply',
        default: null
    },
    toReply: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
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

module.exports = trendReplySchema