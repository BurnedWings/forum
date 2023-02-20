const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var userCollectionSchema = mongoose.Schema({
    user: {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    collectionList:{
        type:[Schema.Types.ObjectId],
        ref:'Collection'
    },
    ...baseModel
});

module.exports = userCollectionSchema