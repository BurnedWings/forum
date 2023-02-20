const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: [String]
    },
    body: {
        type: String,
        required: true
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
    isAudit: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        default: 0
    },
    ...baseModel
}, {
    timestamps: true
});

module.exports = trendSchema