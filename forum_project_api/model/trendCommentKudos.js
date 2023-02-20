const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendCommentsKudosSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    trendComment: {
        type: Schema.Types.ObjectId,
        ref: 'TrendComment'
    },
    ofUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    ...baseModel
});

module.exports = trendCommentsKudosSchema