'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Company Schema
 */
var CompanySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Company name',
    trim: true
  },
  profileImageURL: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: '',
  },
  weOffer: [{
    type: String,
  }],
  website: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    enum: ['Svenska', 'English']
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Company', CompanySchema);
