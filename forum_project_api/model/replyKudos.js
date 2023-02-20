const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var replyKudosSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reply: {
        type: Schema.Types.ObjectId,
        ref: 'Reply'
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

module.exports = replyKudosSchema