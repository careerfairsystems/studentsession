'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Application = mongoose.model('Application'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  async = require('async'),
  htmlpdf = require('html-pdf'),
  http = require('http'),
  https = require('https'),
  fs = require('fs'),
  Zip = require('node-zip'),
  _ = require('lodash'),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));

/**
* Koden redan motsvarar hur servern kan lagra bilder lokalt och via aws s3
*/
// AWS
var multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var s3 = new AWS.S3({ params: { Bucket: config.s3bucket } });

exports.getLogo = function (req, res) {
  var img = req.params.image;
  var url;
  if(process.env.NODE_ENV !== 'production'){
    url = 'http://' + req.headers.host + '/uploads/' + img;
  } else {
    url = s3.getSignedUrl('getObject', { Bucket: config.s3bucket, Key: img });
  }
  res.redirect(url);
};

/**
 * Update profile picture
 */
exports.changeLogo = function (req, res) {
  var company = req.company ? req.company.toJSON() : {};
  var message = null;
  var upload, fileKey;

  // Upload locally if not production.
  if(process.env.NODE_ENV !== 'production'){
    upload = multer(config.uploads.logoUpload).single('newCompanyLogo');
  } else {
    // Production - upload to s3.
    fileKey = 'company_logo_' + Date.now().toString();
    upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: config.s3bucket,
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
          cb(null, fileKey);
        }
      })
    }).single('newCompanyLogo');
  }
  // Filtering to upload only images
  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
  upload.fileFilter = profileUploadFileFilter;

  upload(req, res, function (uploadError) {
    if(uploadError) {
      return res.status(400).send({
        message: 'Error occurred while uploading profile picture:' + uploadError
      });
    } else {
      //Success, Delete old companyLogo if exists.
      if(process.env.NODE_ENV !== 'production'){
        fileKey = req.file.filename;
      } else {
        fileKey = req.file.key;
        if(company.profileImageURL){
          s3.deleteObjects({
            Bucket: config.s3bucket,
            Delete: {
              Objects: [
               { Key: company.profileImageURL }
              ]
            }
          }, function(err, data) {
            if (err)
              return console.log(err);
            console.log('Old company image removed safely.');
          });
        }
      }

      if(req.company){
        //Replace imgurl on company with new one.
        company.profileImageURL = fileKey;

        company.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            res.send(fileKey);
          }
        });
      } else {
        res.send(fileKey);
      }
    }
  });
};

exports.getActive = function(req, res) {
  Company.find({ active: true }).exec(function(err, companies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(companies);
    }
  });
};

/**
 * Create a Company
 */
exports.create = function(req, res) {
  var company = new Company(req.body);
  company.user = req.user;

  company.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(company);
    }
  });
};

/**
 * Show the current Company
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var company = req.company ? req.company.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the 'owner'.
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  company.isCurrentUserOwner = req.user && company.user && company.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(company);
};

/**
 * Update a Company
 */
exports.update = function(req, res) {
  var company = req.company ;

  company = _.extend(company , req.body);

  company.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(company);
    }
  });
};

/**
 * Delete an Company
 */
exports.delete = function(req, res) {
  var company = req.company ;

  company.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(company);
    }
  });
};

/**
 * List of Companies
 */
exports.list = function(req, res) {
  Company.find().sort('-created').populate('user', 'displayName').exec(function(err, companies) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(companies);
    }
  });
};

/**
 * Company middleware
 */
exports.companyByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Company is invalid'
    });
  }

  Company.findById(id).populate('user', 'displayName').exec(function (err, company) {
    if (err) {
      return next(err);
    } else if (!company) {
      return res.status(404).send({
        message: 'No Company with that identifier has been found'
      });
    }
    req.company = company;
    next();
  });
};

function prettify(str){
  return str.replace(/[ÅÄÖåäö ]/g, '');
}

/**
  * Create and merge a complete application PDF.
  */
exports.getAllApplicationsPdfs = function (req, res, next) {
  var companyName = req.params.companyName;
  var zip = new Zip();
  Application.find({ 'companies': { $elemMatch: { name: companyName } } }).exec(function (err, applications) {
    if (err) {
      return next(err);
    } else if (!applications) {
      return res.status(404).send({
        message: 'No Application with that identifier has been found'
      });
    }
    console.log('hej: ' + applications.length);
    if(applications.length === 0){
      res.send('No applications were found.');
    }
    
    var applicationcounter = 0;
    applications.forEach(function(application) {
      getApplicationZip(application, function(zipFiles){
        function addZipFile (zipfile){
          zip.file(zipfile.name, zipfile.file);
        }
        zipFiles.forEach(addZipFile);
        applicationcounter++;
        if(applicationcounter === applications.length){
          zipDone();
        }
      });
    });
    function zipDone(){
      var data = zip.generate({ base64:false,compression:'DEFLATE' });
      res.set('Content-Type', 'application/zip');
      res.set('Content-Disposition', 'attachment; filename=' + companyName + '.zip');
      res.set('Content-Length', data.length);
      res.end(data, 'binary');
      res.status(200).send();
    }
  });
  function getApplicationZip(application, zipDone){
    console.log('Get Application Zip');
    var aname = prettify(application.name);
    var counter = 0;
    function getCompanyZipList(company){
      var zipList = [];
      getApplicationPdfs(application, company.name, function(pdfList){
        console.log('Zip PDFs');
        function addToZipFolder(pdf){
          zipList.push({ name: pdf.name, file: pdf.file });
        }
        pdfList.forEach(addToZipFolder);
        counter++;
        if(counter === application.companies.length){
          zipDone(zipList);
        }
      });
    }
    application.companies.forEach(getCompanyZipList);
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
          url = s3.getSignedUrl('getObject', { Bucket: config.s3bucket, Key: filename });
          https.get(url, function(response) {
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
        }
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

