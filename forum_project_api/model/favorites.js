const mongoose = require('mongoose')
const Schema =mongoose.Schema
const baseModel = require('./base-model')

var favoritesSchema = mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    article:{
        type:Schema.Types.ObjectId,
        ref:'Article'
    },
    collection:{
        type:Schema.Types.ObjectId,
        ref:'Collection'
    },
    cover: {
        type:String,
        default:null
    },
    ...baseModel
});

module.exports = favoritesSchema