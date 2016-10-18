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
  facility: {
    type: String,
    default: ''
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
  lunchStart: {
    type: String,
    default: '12:00'
  },
  lunchEnd: {
    type: String,
    default: '13:00'
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
