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
  desiredProgramme: [{ type: String }],
  branch: [{ type: String }],
  whyStudentSession: {
    type: String,
    default: ''
  },
  didYouKnow: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  language: {
    type: String,
  },
  wednesday: {
    type: Boolean,
    default: false
  },
  thursday: {
    type: Boolean,
    default: false
  },
  meetingLength: {
    type: Number,
    default: 0
  },
  chosenStudents: [{
    type: Schema.ObjectId,
    ref: 'Application'
  }],
  active: {
    type: Boolean,
    default: false
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
