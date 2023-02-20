const mongoose = require('mongoose')
const Schema =mongoose.Schema
const baseModel = require('./base-model')

var articleMessageSchema = mongoose.Schema({
    type:{
        type:Number,
        required:true
    },
    message:{
        type:String,
        default:null
    },
    article:{
        type:String,
        default:null
    },
    ofUser:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    isChecked:{
        type:Boolean,
        default:false
    },
    ...baseModel
});

module.exports = articleMessageSchema