const mongoose = require('mongoose')
const Schema =mongoose.Schema
const baseModel = require('./base-model')

var forbidSchema = mongoose.Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    ...baseModel
});

module.exports = forbidSchema