const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var noticeCheckedSchema = mongoose.Schema({
    notice: {
        type: Schema.Types.ObjectId,
        ref: 'Notice'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    ...baseModel
});

module.exports = noticeCheckedSchema