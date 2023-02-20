const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var collectionSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    collectionName: {
        type: String,
        required: true
    },
    userCollection: {
        type: Schema.Types.ObjectId,
        ref: 'UserCollection'
    },
    articleCount: {
        type: Number,
        default: 0
    },
    ...baseModel
});

module.exports = collectionSchema