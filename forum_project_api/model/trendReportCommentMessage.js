const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendReportCommentMessageSchema = mongoose.Schema({
    comment: {
        type: String,
        default: null
    },
    reply: {
        type: String,
        default: null
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

module.exports = trendReportCommentMessageSchema