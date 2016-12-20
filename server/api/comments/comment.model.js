'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    author: {
        id: {
            type: Schema.ObjectId,
            ref: "User" // Reference to User schema.
        },
        name: {
            type: String
        },
        email: {
            type: String
        }
    },
    lookId: {
        type: Schema.ObjectId,
        ref: "Look" // Reference to Look schema.
    },
    gravatar: {
        type: String
    },
    comment: {
        type: String,
        trim: true // Remove whitspace from both sides of a string.
    },
    createTime: {
        type: Date,
        "default": Date.now
    }
});

module.exports = mongoose.model("Comment", CommentSchema);
