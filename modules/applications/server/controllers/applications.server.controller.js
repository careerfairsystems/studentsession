'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Application = mongoose.model('Application'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  config = require(path.resolve('./config/config.js')),
  multer = require('multer');

/**
 * Create a Application
 */
exports.create = function(req, res) {
  var application = new Application(req.body);
  application.user = req.user;

  application.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(application);
    }
  });
};

/**
 * Show the current Application
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var application = req.application ? req.application.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  application.isCurrentUserOwner = req.user && application.user && application.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(application);
};

/**
 * Update a Application
 */
exports.update = function(req, res) {
  var application = req.application ;

  application = _.extend(application , req.body);

  application.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(application);
    }
  });
};

/**
 * Delete an Application
 */
exports.delete = function(req, res) {
  var application = req.application ;

  application.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(application);
    }
  });
};

/**
 * List of Applications
 */
exports.list = function(req, res) { 
  Application.find().sort('-created').populate('user', 'displayName').exec(function(err, applications) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applications);
    }
  });
};

/**
 * Application middleware
 */
exports.applicationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Application is invalid'
    });
  }

  Application.findById(id).populate('user', 'displayName').exec(function (err, application) {
    if (err) {
      return next(err);
    } else if (!application) {
      return res.status(404).send({
        message: 'No Application with that identifier has been found'
      });
    }
    req.application = application;
    next();
  });
};

/**
 * Update attachment-pdf
 */
exports.addResumeAttachment = function (req, res) { //när körs denna?
  var pdfName = req.params.pdfName;
  var message = null;
 
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/resume/'); //här sparas cv
    },
    filename: function (req, file, cb) {
      cb(null, pdfName);
    }
  });

  config.uploads.resumeUpload.storage = storage;

  var upload = multer(config.uploads.resumeUpload).single('newResume');
  var resumeFileFilter = require(path.resolve('./config/lib/multer')).resumeFileFilter;
  
  // Filtering to upload only pdf's
  upload.fileFilter = resumeFileFilter;

  upload(req, res, function (uploadError) {
    if(uploadError) {
      return res.status(400).send({
        message: uploadError
      });
    } else {
      return res.status(200).send({
        message: 'Upload succeeded.'
      });
    }
  });
};
