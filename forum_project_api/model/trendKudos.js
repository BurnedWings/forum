const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var trendKudosSchema = mongoose.Schema({
    trend: {
        type: Schema.Types.ObjectId,
        ref: 'Trend'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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

module.exports = trendKudosSchema