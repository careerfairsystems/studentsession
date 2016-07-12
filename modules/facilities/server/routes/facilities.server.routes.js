'use strict';

/**
 * Module dependencies
 */
var facilitiesPolicy = require('../policies/facilities.server.policy'),
  facilities = require('../controllers/facilities.server.controller');

module.exports = function(app) {
  // Facilities Routes
  app.route('/api/facilities').all(facilitiesPolicy.isAllowed)
    .get(facilities.list)
    .post(facilities.create);

  app.route('/api/facilities/:facilityId').all(facilitiesPolicy.isAllowed)
    .get(facilities.read)
    .put(facilities.update)
    .delete(facilities.delete);

  // Finish by binding the Facility middleware
  app.param('facilityId', facilities.facilityByID);
};
