const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var collectionItemSchema = mongoose.Schema({
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ofCollection: {
        type: Schema.Types.ObjectId,
        ref: 'Collection'
    },
    ...baseModel
});

module.exports = collectionItemSchema