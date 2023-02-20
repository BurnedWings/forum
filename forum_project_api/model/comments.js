const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var commentsSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article',
        default: null
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    body: {
        type: String,
        required: true
    },
    replyList: {
        type: [Schema.Types.ObjectId],
        ref: 'Reply'
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    ...baseModel
});

module.exports = commentsSchema