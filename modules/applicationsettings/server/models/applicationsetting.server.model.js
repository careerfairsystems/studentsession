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
    required: 'Vänligen fyll i startdatum för ansökningsperiod'
  },
  enddate: {
    type: Date,
    required: 'Vänligen fyll i startdatum för ansökningsperiod'
  },
  meetingtime: {
    type: String,
    required: 'Vänligen fyll i standard mötestid'
  },
  terminatedate: {
    type: Date,
    required: 'Vänligen fyll i slutdatum för denna inställning'
  },
  name: {
    type: String,
    default: '',
    required: 'Please fill Applicationsetting name',
    trim: true
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
