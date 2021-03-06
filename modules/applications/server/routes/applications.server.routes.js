'use strict';

/**
 * Module dependencies
 */
var applicationsPolicy = require('../policies/applications.server.policy'),
  applications = require('../controllers/applications.server.controller'); 

module.exports = function(app) {
  // Applications Routes
  app.route('/api/applications/confirmationmail')
    .post(applications.confirmationMail);

  app.route('/api/applications/generatepdf/:applicationId')
    .get(applications.createApplicationPdf);

  app.route('/api/applications').post(applications.create);

  app.route('/api/applications').all(applicationsPolicy.isAllowed)
    .get(applications.list);

  app.route('/api/applications/htmlpdf/:pdfName')
    .get(applications.getHtmlPdf);

  app.route('/api/applications/resume/:pdfName')
    .get(applications.getResume);

  app.route('/api/applications/resume/').all(applicationsPolicy.isAllowed)
    .post(applications.addResumeAttachment);

  app.route('/api/applications/:applicationId').all(applicationsPolicy.isAllowed)
    .get(applications.read)
    .put(applications.update)
    .delete(applications.delete);

  // Finish by binding the Application middleware
  app.param('applicationId', applications.applicationByID);
};
