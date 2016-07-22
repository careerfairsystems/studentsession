'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Facility Schema
 */
var FacilitySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Facility name',
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

mongoose.model('Facility', FacilitySchema);
