const mongoose = require('mongoose')
const Schema = mongoose.Schema
const baseModel = require('./base-model')

var fansSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ofUser: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ...baseModel
});

module.exports = fansSchema