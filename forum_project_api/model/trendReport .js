const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendReportSchema = mongoose.Schema({
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
        default: null
    },
    trend: {
        type: Schema.Types.ObjectId,
        ref: 'Trend'
    },
    ofUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ...baseModel
});

module.exports = trendReportSchema