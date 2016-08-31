'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Applicationsetting Schema
 */
var ApplicationsettingSchema = new Schema({
  startdate: {
    type: Date,
    required: 'Please fill the start date for the application period'
  },
  enddate: {
    type: Date,
    required: 'Please fill the end date for the application period'
  },
  terminatedate: {
    type: Date,
    required: 'Please fill the date of termination for this setting'
  },
  frontpagehtml: {
    type: String,
    default: '',
    required: 'Please fill HTML code for front page'
  },
  meetingtime: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Applicationsetting name',
    trim: true
  },
  active: {
    type: Boolean,
    default:false
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

mongoose.model('Applicationsetting', ApplicationsettingSchema);
