'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Application Schema
 */
var ApplicationSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    required:true
  },
  year: {
    type: String,
    required: true
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  companies: [{
    name: String
  }],
  attachments: [{
    language: String,
    link: String
  }],
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
    //hämta denna information från användaren?
  },
  times: [{
    time: String
  }],
  program: {
    type: String,
    required: true
  },
  descriptions: [{
    companyName: String,
    description: String
  }]
});

mongoose.model('Application', ApplicationSchema);
