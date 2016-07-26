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
    required: 'Vänligen fyll i lokal',

  },
  company: {
    type: String,
    default: ''
  },
  student: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    required: 'Vänligen välj datum och tid'
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

mongoose.model('Meeting', MeetingSchema);
