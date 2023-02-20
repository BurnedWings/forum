const mongoose = require('mongoose')
const md5 = require('../util/md5')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var emailSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    emailList: {
        type: [String],
        default: null
    },
    spareEmail: {
        type: String,
        default: null
    },
    ...baseModel
});

module.exports = emailSchema