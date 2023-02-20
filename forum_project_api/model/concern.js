const mongoose = require('mongoose')
const Schema =mongoose.Schema
const baseModel = require('./base-model')

var concernSchema = mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    ...baseModel
});

module.exports = concernSchema