'use strict';

var passport = require('passport'),
users = require('../../controllers/users.server.controller'),
mongoose = require('mongoose'),
User = mongoose.model('User');


module.exports = function (config) {
  passport.use(new (require('passport-cas').Strategy)({
    ssoBaseURL: 'https://cas.lu.se/cas',
    serverBaseURL: 'http://localhost:3000',
    serviceURL: '/api/auth/cas/callback',
    passReqToCallback: true
  }, function(req, profile, done) {
     
    console.log("profile: ", profile);
    // Save the user OAuth profile
    var providerUserProfile = {
      displayName: profile,
      username: profile,
      provider: 'cas',
      providerIdentifierField: 'username',
      providerData: {'username': profile}
    };
    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};