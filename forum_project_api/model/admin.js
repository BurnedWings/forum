const mongoose = require('mongoose')
const Schema =mongoose.Schema
const md5 = require('../util/md5')
const baseModel = require('./base-model')

var adminSchema = mongoose.Schema({
    username: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true,
        set: value => md5(value),
        select:false
    },
    image: {
        type:String,
        default:'avatars/default.jpg'
    },
    permissionsList:{
        type:[Number]
    },
    isSuper:{
        type:Boolean,
        default:false
    },
    ...baseModel
});

module.exports = adminSchema