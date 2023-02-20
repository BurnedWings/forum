const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var noticeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
    },
    isChecked: {
        type: Boolean,
        default: false
    },
    ...baseModel
});

module.exports = noticeSchema