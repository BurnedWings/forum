const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var articleCollectionItemSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    article:{
        type: Schema.Types.ObjectId,
        ref:'Article'
    },
    articleCollection:{
        type: Schema.Types.ObjectId,
        ref:'ArticleCollection'
    },
    ...baseModel
},{
    timestamps: true
});

module.exports = articleCollectionItemSchema