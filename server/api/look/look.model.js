'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LookSchema = new Schema({
  title: String,
  description: String,
  tags: [{
    type: String
  }],
  _creator: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  email: String,
  userName: String,
  createTime: {
    type: Date,
    'default': Date.now
  },
  upVotes: {
    type: Number,
    'default': 0
  },
  downVotes: {
    type: Number,
    'default': 0
  }
});

module.exports = mongoose.model('Look', LookSchema);
