'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  filePluginLib = require('mongoose-file'),
  filePlugin = filePluginLib.filePlugin,
  make_upload_to_model = filePluginLib.make_upload_to_model,
  path = require('path'),
  uploads_base = path.join(__dirname, 'public/uploads'),
  uploads = path.join(uploads_base, 'u');

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

ApplicationSchema.plugin(filePlugin, {
  name: 'resume',
  upload_to: make_upload_to_model(uploads, 'pdfs'), //pdfs tidigare photos
  relative_to: uploads_base
});

mongoose.model('Application', ApplicationSchema);
