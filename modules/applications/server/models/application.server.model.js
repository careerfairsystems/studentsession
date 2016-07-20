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
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  companies: {
    type: [String],
    required: true
  },
  resume: {
    type: String,
    required: true //lägg till två platser här, en för eng en för svenska. hur ändå bara en required?
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
    //hämta denna information från användaren?
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
