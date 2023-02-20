const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var articleKudosSchema = mongoose.Schema({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
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

module.exports = articleKudosSchema