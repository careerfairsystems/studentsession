'use strict';

/**
 * Module dependencies
 */
var companiesPolicy = require('../policies/companies.server.policy'),
  companies = require('../controllers/companies.server.controller');

module.exports = function(app) {
  // Companies Routes
  app.route('/api/companies').all(companiesPolicy.isAllowed)
    .get(companies.list)
    .post(companies.create);

  app.route('/api/companies/:companyId').all(companiesPolicy.isAllowed)
    .get(companies.read)
    .put(companies.update)
    .delete(companies.delete);

/**
* dessa routes kan användas vid lokal bildlagring samt via s3
*/
//  app.route('/api/companies/picture').post(companies.changeProfilePicture);
//  app.route('/api/companies/picture/:image').get(companies.getProfilePicture);

  // Finish by binding the Company middleware
  app.param('companyId', companies.companyByID);
};
