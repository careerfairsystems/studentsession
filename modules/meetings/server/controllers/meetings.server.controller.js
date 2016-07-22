'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Meeting = mongoose.model('Meeting'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meeting
 */
exports.create = function(req, res) {
  var meeting = new Meeting(req.body);
  meeting.user = req.user;

  meeting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meeting);
    }
  });
};

/**
 * Show the current Meeting
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var meeting = req.meeting ? req.meeting.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  meeting.isCurrentUserOwner = req.user && meeting.user && meeting.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(meeting);
};

/**
 * Update a Meeting
 */
exports.update = function(req, res) {
  var meeting = req.meeting ;

  meeting = _.extend(meeting , req.body);

  meeting.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meeting);
    }
  });
};

/**
 * Delete an Meeting
 */
exports.delete = function(req, res) {
  var meeting = req.meeting ;

  meeting.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meeting);
    }
  });
};

/**
 * List of Meetings
 */
exports.list = function(req, res) { 
  Meeting.find().sort('-created').populate('user', 'displayName').exec(function(err, meetings) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meetings);
    }
  });
};

/**
 * Meeting middleware
 */
exports.meetingByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Meeting is invalid'
    });
  }

  Meeting.findById(id).populate('user', 'displayName').exec(function (err, meeting) {
    if (err) {
      return next(err);
    } else if (!meeting) {
      return res.status(404).send({
        message: 'No Meeting with that identifier has been found'
      });
    }
    req.meeting = meeting;
    next();
  });
};
