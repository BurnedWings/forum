const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var replySchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    body: {
        type: String,
        required: true
    },
    toReplyId: {
        type: Schema.Types.ObjectId,
        ref: 'Reply',
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

module.exports = replySchema