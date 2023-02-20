const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var commentsKudosSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
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

module.exports = commentsKudosSchema