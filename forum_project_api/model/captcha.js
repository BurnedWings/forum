const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var captchaSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    captcha: {
        type: String,
        required: true
    },
    ...baseModel
});

module.exports = captchaSchema