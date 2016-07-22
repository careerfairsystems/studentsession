'use strict';

/**
 * Module dependencies
 */
var meetingsPolicy = require('../policies/meetings.server.policy'),
  meetings = require('../controllers/meetings.server.controller');

module.exports = function(app) {
  // Meetings Routes
  app.route('/api/meetings').all(meetingsPolicy.isAllowed)
    .get(meetings.list)
    .post(meetings.create);

  app.route('/api/meetings/:meetingId').all(meetingsPolicy.isAllowed)
    .get(meetings.read)
    .put(meetings.update)
    .delete(meetings.delete);

  // Finish by binding the Meeting middleware
  app.param('meetingId', meetings.meetingByID);
};
