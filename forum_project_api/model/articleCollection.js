const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var articleCollectionSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    keyWord: {
        type: String,
        required: true
    },
    articleList: {
        type: [Schema.Types.ObjectId],
        ref: 'Article',
        default: []
    },
    ...baseModel
},{
    timestamps: true
});

module.exports = articleCollectionSchema