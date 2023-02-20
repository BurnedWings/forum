const mongoose = require('mongoose')
const md5 = require('../util/md5')
const baseModel = require('./base-model')

var reportTypeSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    ...baseModel
});

module.exports = reportTypeSchema