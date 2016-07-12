'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Facility = mongoose.model('Facility'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Facility
 */
exports.create = function(req, res) {
  var facility = new Facility(req.body);
  facility.user = req.user;

  facility.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(facility);
    }
  });
};

/**
 * Show the current Facility
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var facility = req.facility ? req.facility.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  facility.isCurrentUserOwner = req.user && facility.user && facility.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(facility);
};

/**
 * Update a Facility
 */
exports.update = function(req, res) {
  var facility = req.facility ;

  facility = _.extend(facility , req.body);

  facility.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(facility);
    }
  });
};

/**
 * Delete an Facility
 */
exports.delete = function(req, res) {
  var facility = req.facility ;

  facility.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(facility);
    }
  });
};

/**
 * List of Facilities
 */
exports.list = function(req, res) { 
  Facility.find().sort('-created').populate('user', 'displayName').exec(function(err, facilities) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(facilities);
    }
  });
};

/**
 * Facility middleware
 */
exports.facilityByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Facility is invalid'
    });
  }

  Facility.findById(id).populate('user', 'displayName').exec(function (err, facility) {
    if (err) {
      return next(err);
    } else if (!facility) {
      return res.status(404).send({
        message: 'No Facility with that identifier has been found'
      });
    }
    req.facility = facility;
    next();
  });
};
