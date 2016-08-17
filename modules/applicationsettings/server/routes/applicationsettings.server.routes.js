'use strict';

/**
 * Module dependencies
 */
var applicationsettingsPolicy = require('../policies/applicationsettings.server.policy'),
  applicationsettings = require('../controllers/applicationsettings.server.controller');

module.exports = function(app) {
  // Applicationsettings Routes
  app.route('/api/applicationsettings').all(applicationsettingsPolicy.isAllowed)
    .get(applicationsettings.list)
    .post(applicationsettings.create);

  app.route('/api/applicationsettings/:applicationsettingId').all(applicationsettingsPolicy.isAllowed)
    .get(applicationsettings.read)
    .put(applicationsettings.update)
    .delete(applicationsettings.delete);

  // Finish by binding the Applicationsetting middleware
  app.param('applicationsettingId', applicationsettings.applicationsettingByID);
};
