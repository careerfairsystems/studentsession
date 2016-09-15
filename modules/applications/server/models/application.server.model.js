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
  companies: {
    type: [String],
    required: true
  },
  attachments: [{
    language: String,
    description: String,
    link: String
  }],
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  times: {
    type: [String],
    required: true
  },
  program: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

mongoose.model('Application', ApplicationSchema);
