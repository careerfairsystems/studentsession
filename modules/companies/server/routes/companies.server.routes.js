'use strict';

/**
 * Module dependencies
 */
var companiesPolicy = require('../policies/companies.server.policy'),
  companies = require('../controllers/companies.server.controller');

module.exports = function(app) {
  // Companies Routes

  app.route('/api/companies/active')
    .get(companies.getActive);

  app.route('/api/companies/applicantszip/:companyName').all(companiesPolicy.isAllowed)
    .get(companies.getAllApplicationsPdfs);

  app.route('/api/companies').all(companiesPolicy.isAllowed)
    .get(companies.list)
    .post(companies.create);

  // The correct order is important, these need to be before
  // /api/companies/:companyId
  app.route('/api/companies/logo/:image').get(companies.getLogo);
  app.route('/api/companies/logo').post(companies.changeLogo);


  app.route('/api/companies/:companyId').all(companiesPolicy.isAllowed)
    .get(companies.read)
    .put(companies.update)
    .delete(companies.delete);

  // Finish by binding the Company middleware
  app.param('companyId', companies.companyByID);
};
