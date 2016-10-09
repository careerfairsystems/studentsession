'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meeting Schema
 */
var MeetingSchema = new Schema({

  facility: {
    type: String,
    default: '',
    required: 'true',
  },
  company: {
    id: {
      type: Schema.ObjectId,
      ref: 'Company'
    },
    name: {
      type: String,
      default: ''
    }
  },
  student: {
    id: {
      type: Schema.ObjectId,
      ref: 'Application'
    },
    name: {
      type: String,
      default: ''
    }
  },
  startTime: String,
  endTime: String,
  day: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Meeting', MeetingSchema);
