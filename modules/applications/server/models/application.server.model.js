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
    required: 'Välj minst ett företag som du vill söka kontaktsamtal med.'
  },
  resume: {
    type: String,
    required: 'Bifoga ditt CV.'
  },
  phone: {
    type: String,
    required: 'Ange ditt telefonnummer.'
  },
  email: {
    type: String,
    required: 'Ange din emailadress.'
    //Hämta denna information från användaren??
  },
  times: {
    type: [String],
    required: 'Ange de tider du kan.'
  }
});

mongoose.model('Application', ApplicationSchema);
