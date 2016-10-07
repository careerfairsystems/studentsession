'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Application = mongoose.model('Application'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  nodemailer = require('nodemailer'),
  async = require('async'),
  htmlpdf = require('html-pdf'),
  http = require('http'),
  fs = require('fs'),
  Zip = require('node-zip'),
  _ = require('lodash'),
  config = require(path.resolve('./config/config.js')),
  multer = require('multer');

// Libraries to upload to S3
// AWS
var multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var s3 = new AWS.S3({ params: { Bucket: config.s3bucket } });
var smtpTransport = nodemailer.createTransport(config.mailer.options);

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

  // Add a custom field to the Article, for determining if the current User is the 'owner'.
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
 * Get attachment-pdf
 */
exports.getResume = function (req, res) {
  var filename = req.params.pdfName;
  var url;
  if(process.env.NODE_ENV !== 'production'){
    url = 'http://' + req.headers.host + '/uploads/' + filename;
  } else {
    url = s3.getSignedUrl('getObject', { Bucket: config.s3bucket, Key: filename });
  }
  res.redirect(url);
};


/**
 * Update attachment-pdf
 */
exports.addResumeAttachment = function (req, res) { //när körs denna?
  var pdfName = 'resume_' + Date.now().toString();
  var message = null;
  var upload;

  // Upload locally if not production.
  if(process.env.NODE_ENV !== 'production'){
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, './public/uploads/'); //här sparas cv
      },
      filename: function (req, file, cb) {
        cb(null, pdfName);
      }
    });
    config.uploads.resumeUpload.storage = storage;
    upload = multer(config.uploads.resumeUpload).single('newResume');
  } else {
    // Production - upload to s3.
    upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: config.s3bucket,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, pdfName);
        }
      })
    }).single('newResume'); 
  }
  var resumeFileFilter = require(path.resolve('./config/lib/multer')).resumeFileFilter;
  upload.fileFilter = resumeFileFilter;

  upload(req, res, function (uploadError) {
    if(uploadError) {
      return res.status(400).send({
        message: uploadError
      });
    } else {
      return res.status(200).send(pdfName);
    }
  });
};

/**
  * Send confirmation mail to applicant (POST)
  */
exports.confirmationMail = function (req, res, next) {
  var id = req.body.applicationId;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Application is invalid'
    });
  }
  async.waterfall([
    function (done) {
      Application.findById(id).populate('user', 'displayName').exec(function (err, application) {
        if (err) {
          return next(err);
        } else if (!application) {
          return res.status(404).send({
            message: 'No Application with that identifier has been found'
          });
        }
        done(err, application);
      });
    },
    function (application, done) {
      var httpTransport = 'http://';
      if (config.secure && config.secure.ssl === true) {
        httpTransport = 'https://';
      }
      function companyToString (c){
        return c.name;
      }
      var comps = application.companies.map(companyToString);
      var joinedComps = comps.join(', ');
      console.log('hej: ' + comps);
      res.render(path.resolve('modules/applications/server/templates/mailconfirmation'), {
        name: application.name,
        appName: config.app.title,
        companies: joinedComps,
      }, function (err, emailHTML) {
        done(err, emailHTML, application);
      });
    },
    // If valid email, send reset email using service
    function (emailHTML, application, done) {
      var mailOptions = {
        to: application.email,
        from: config.mailer.from,
        subject: 'Bekräftelse Kontaktsamtalsansökan / Confirmation Student Session Application',
        html: emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'An email has been sent to the provided email with further instructions.'
          });
        } else {
          return res.status(400).send({
            message: 'Failure sending email: ' + err
          });
        }
        done(err);
      });
    }
  ], function (err) {
    if (err) {
      return next(err);
    }
  });
};

function prettify(str){
  return str.replace(/[ÅÄÖåäö ]/g, '');
}

/**
  * Create and merge a complete application PDF.
  */
exports.createApplicationPdf = function (req, res, next) {
  var id = req.params.applicationId;
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
    getApplicationZip(application);
  });
  function getApplicationZip(application){
    console.log('Get Application Zip');
    var zip = new Zip();
    var aname = prettify(application.name);
    function zipDone(companyName){
      var data = zip.generate({ base64:false,compression:'DEFLATE' });
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', 'attachment; filename=' + aname + '.zip');
      res.set('Content-Length', data.length);
      res.end(data, 'binary');
      res.status(200).send();
    }
    var counter = 0;
    function getCompanyZipFolder(company){
      var zipFolder = zip.folder(aname + '_' + prettify(company.name)); 
      getApplicationPdfs(application, company.name, function(pdfList){
        console.log('Merge PDFs');
        function addToZipFolder(pdf){
          zipFolder.file(pdf.name, pdf.file);
        }
        pdfList.forEach(addToZipFolder);
        counter++;
        if(counter === application.companies.length){
          zipDone(company.name);
        }
      });
    }
    application.companies.forEach(getCompanyZipFolder);
  }  

  function getApplicationPdfs(application, companyName, pdfListDone) {
    console.log('Get ApplicationPdfs');
    var pdfList = [];
    
    function isSelectedCompany(c){
      return c.name === companyName; 
    }
    var selectedCompanies = application.companies.filter(isSelectedCompany);
    if(selectedCompanies.length < 1){
      console.log('Not selected this company');
      pdfListDone(pdfList);
      return;
    }
    var selectedCompany = selectedCompanies[0];
    
    function renderPdfHtml(done) {
      console.log('Render HTML of pdf');
      res.render(path.resolve('modules/applications/server/templates/applicationpdf'), {
        application: application,
        appName: config.app.title,
        company: selectedCompany,
      }, function (err, pdfHTML) {
        done(err, pdfHTML);
      });
    }
    function generatePdfFromHtml(pdfHTML, done) {
      console.log('Create pdfHTML');
      var options = { format: 'Letter' };
      application.name = prettify(application.name);
      var cname = prettify(selectedCompany.name);
      var pdfName = application.name + '_' + cname + '.pdf';
      var path = './public/uploads/temp/';

      htmlpdf.create(pdfHTML, options).toFile(path + pdfName, function(err, res) {
        console.log('pdf created: ' + pdfName); 
        if (err) {
          console.log('Error: ' + err);
        }
        fs.readFile(res.filename, function read(err, result) {
          pdfList.push({ name: application.name + '_' + cname + '.pdf', file: result });
          done(err);
        });
      });  
    }
    function getPdf(newfilename, path, done) {
      console.log('Get:' + newfilename);
      if(path) {
        var url, filename = path;
        if(process.env.NODE_ENV !== 'production'){
          url = 'http://' + req.headers.host + '/uploads/' + filename;
        } else {
          url = s3.getSignedUrl('getObject', { Bucket: config.s3bucket, Key: filename });
        }
        http.get(url, function(response) {
          var chunks = [];
          response.on('data', function(chunk) {
            chunks.push(chunk);
          });
          response.on('end', function() {
            console.log('downloaded');
            var jsfile = new Buffer.concat(chunks);
            pdfList.push({ name: newfilename, file: jsfile });
            done(null);
          });
        }).on('error', function() {
          res.status(400).send({
            message: 'Failure getting EngPdf'
          });
        });  
      } else {
        done(null);
      }
    }
    var engpath = application.resume.swedishLink;
    var swepath = application.resume.swedishLink;
    function getSwePdf(done) {
      if(!selectedCompany.lang || selectedCompany.lang === 'Svenska' || !engpath){
        getPdf(application.name + '_resume_swe.pdf', swepath, done);
      } else {
        done(null);
      }
    }
    function getEngPdf(done) {
      if(!selectedCompany.lang || selectedCompany.lang === 'English' || !swepath){
        getPdf(application.name + '_resume_eng.pdf', engpath, done);
      } else {
        done(null);
      }
    }
    var zipFile = {};

    async.waterfall([
      renderPdfHtml,
      generatePdfFromHtml,
      getSwePdf,
      getEngPdf,
    ], function (err) {
      if (err) {
        console.log('Error... ' + err);
        return next(err);
      }
      pdfListDone(pdfList);
    });
  }
};

