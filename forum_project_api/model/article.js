const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ArticleType'
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    tagList: {
        type: [String],
        default: null
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    collectionCount: {
        type: Number,
        default: 0
    },
    clicksCount: {
        type: Number,
        default: 0
    },
    favoritesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    cover: {
        type: String,
        default: null
    },
    isKudos: {
        type: Boolean,
        default: false
    },
    isAudit: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        default: 0
    },
    isRecommend: {
        type: Boolean,
        default: false
    },
    ...baseModel
}, {
    timestamps: true
});

module.exports = articleSchema