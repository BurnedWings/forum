const mongoose = require('mongoose')
const md5 = require('../util/md5')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var birthdaySchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    email: {
        type: String,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    ...baseModel
});

module.exports = birthdaySchema