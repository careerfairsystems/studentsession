'use strict';

module.exports.profileUploadFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    return cb(new Error('Endast bildfiler är tillåtna!'), false);
  }
  cb(null, true);
};

module.exports.resumeFileFilter = function (req, file, cb) {
  if (file.mimetype !== 'pdf') {
    return cb(new Error('Endast pdf-filer är tillåtna!'), false);
  }
  cb(null, true);
};
