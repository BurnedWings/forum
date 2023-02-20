const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendReplyKudosSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    trendReply: {
        type: Schema.Types.ObjectId,
        ref: 'TrendReply'
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

module.exports = trendReplyKudosSchema