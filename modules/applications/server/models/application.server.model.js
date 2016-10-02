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
    name: String,
    motivation: String
  }],
  resume: {
    swedishLink: String,
    englishLink: String
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  times: [{ day: String, hour: [ Number ] }],
  program: {
    type: String,
    required: true
  },
});

mongoose.model('Application', ApplicationSchema);
