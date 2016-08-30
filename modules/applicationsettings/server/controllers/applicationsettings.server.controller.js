'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Applicationsetting = mongoose.model('Applicationsetting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Applicationsetting
 */
exports.create = function(req, res) {
  var applicationsetting = new Applicationsetting(req.body);
  applicationsetting.user = req.user;

  applicationsetting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applicationsetting);
    }
  });
};

/**
 * Show the current Applicationsetting
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var applicationsetting = req.applicationsetting ? req.applicationsetting.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  applicationsetting.isCurrentUserOwner = req.user && applicationsetting.user && applicationsetting.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(applicationsetting);
};

/**
 * Update a Applicationsetting
 */
exports.update = function(req, res) {
  var applicationsetting = req.applicationsetting ;

  applicationsetting = _.extend(applicationsetting , req.body);

  applicationsetting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applicationsetting);
    }
  });
};

/**
 * Delete an Applicationsetting
 */
exports.delete = function(req, res) {
  var applicationsetting = req.applicationsetting ;

  applicationsetting.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applicationsetting);
    }
  });
};

/**
 * List of Applicationsettings
 */
exports.list = function(req, res) { 
  Applicationsetting.find().sort('-created').populate('user', 'displayName').exec(function(err, applicationsettings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(applicationsettings);
    }
  });
};

/**
 * Applicationsetting middleware
 */
exports.applicationsettingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Applicationsetting is invalid'
    });
  }

  Applicationsetting.findById(id).populate('user', 'displayName').exec(function (err, applicationsetting) {
    if (err) {
      return next(err);
    } else if (!applicationsetting) {
      return res.status(404).send({
        message: 'No Applicationsetting with that identifier has been found'
      });
    }
    req.applicationsetting = applicationsetting;
    next();
  });
};
