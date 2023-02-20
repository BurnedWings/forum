const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendCommentReportSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'ReportType'
    },
    message: {
        type: String,
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'TrendComment',
        default: null
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'TrendReply',
        default: null
    },
    ofUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ...baseModel
});

module.exports = trendCommentReportSchema