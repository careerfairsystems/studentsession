'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Application = mongoose.model('Application'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, application;

/**
 * Application routes tests
 */
describe('Application CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Application
    user.save(function () {
      application = {
        name: 'Application name'
      };

      done();
    });
  });

  it('should be able to save a Application if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Application
        agent.post('/api/applications')
          .send(application)
          .expect(200)
          .end(function (applicationSaveErr, applicationSaveRes) {
            // Handle Application save error
            if (applicationSaveErr) {
              return done(applicationSaveErr);
            }

            // Get a list of Applications
            agent.get('/api/applications')
              .end(function (applicationsGetErr, applicationsGetRes) {
                // Handle Application save error
                if (applicationsGetErr) {
                  return done(applicationsGetErr);
                }

                // Get Applications list
                var applications = applicationsGetRes.body;

                // Set assertions
                (applications[0].user._id).should.equal(userId);
                (applications[0].name).should.match('Application name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Application if not logged in', function (done) {
    agent.post('/api/applications')
      .send(application)
      .expect(403)
      .end(function (applicationSaveErr, applicationSaveRes) {
        // Call the assertion callback
        done(applicationSaveErr);
      });
  });

  it('should not be able to save an Application if no name is provided', function (done) {
    // Invalidate name field
    application.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Application
        agent.post('/api/applications')
          .send(application)
          .expect(400)
          .end(function (applicationSaveErr, applicationSaveRes) {
            // Set message assertion
            (applicationSaveRes.body.message).should.match('Please fill Application name');

            // Handle Application save error
            done(applicationSaveErr);
          });
      });
  });

  it('should be able to update an Application if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Application
        agent.post('/api/applications')
          .send(application)
          .expect(200)
          .end(function (applicationSaveErr, applicationSaveRes) {
            // Handle Application save error
            if (applicationSaveErr) {
              return done(applicationSaveErr);
            }

            // Update Application name
            application.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Application
            agent.put('/api/applications/' + applicationSaveRes.body._id)
              .send(application)
              .expect(200)
              .end(function (applicationUpdateErr, applicationUpdateRes) {
                // Handle Application update error
                if (applicationUpdateErr) {
                  return done(applicationUpdateErr);
                }

                // Set assertions
                (applicationUpdateRes.body._id).should.equal(applicationSaveRes.body._id);
                (applicationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Applications if not signed in', function (done) {
    // Create new Application model instance
    var applicationObj = new Application(application);

    // Save the application
    applicationObj.save(function () {
      // Request Applications
      request(app).get('/api/applications')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Application if not signed in', function (done) {
    // Create new Application model instance
    var applicationObj = new Application(application);

    // Save the Application
    applicationObj.save(function () {
      request(app).get('/api/applications/' + applicationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', application.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Application with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/applications/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Application is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Application which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Application
    request(app).get('/api/applications/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Application with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Application if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Application
        agent.post('/api/applications')
          .send(application)
          .expect(200)
          .end(function (applicationSaveErr, applicationSaveRes) {
            // Handle Application save error
            if (applicationSaveErr) {
              return done(applicationSaveErr);
            }

            // Delete an existing Application
            agent.delete('/api/applications/' + applicationSaveRes.body._id)
              .send(application)
              .expect(200)
              .end(function (applicationDeleteErr, applicationDeleteRes) {
                // Handle application error error
                if (applicationDeleteErr) {
                  return done(applicationDeleteErr);
                }

                // Set assertions
                (applicationDeleteRes.body._id).should.equal(applicationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Application if not signed in', function (done) {
    // Set Application user
    application.user = user;

    // Create new Application model instance
    var applicationObj = new Application(application);

    // Save the Application
    applicationObj.save(function () {
      // Try deleting Application
      request(app).delete('/api/applications/' + applicationObj._id)
        .expect(403)
        .end(function (applicationDeleteErr, applicationDeleteRes) {
          // Set message assertion
          (applicationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Application error error
          done(applicationDeleteErr);
        });

    });
  });

  it('should be able to get a single Application that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Application
          agent.post('/api/applications')
            .send(application)
            .expect(200)
            .end(function (applicationSaveErr, applicationSaveRes) {
              // Handle Application save error
              if (applicationSaveErr) {
                return done(applicationSaveErr);
              }

              // Set assertions on new Application
              (applicationSaveRes.body.name).should.equal(application.name);
              should.exist(applicationSaveRes.body.user);
              should.equal(applicationSaveRes.body.user._id, orphanId);

              // force the Application to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Application
                    agent.get('/api/applications/' + applicationSaveRes.body._id)
                      .expect(200)
                      .end(function (applicationInfoErr, applicationInfoRes) {
                        // Handle Application error
                        if (applicationInfoErr) {
                          return done(applicationInfoErr);
                        }

                        // Set assertions
                        (applicationInfoRes.body._id).should.equal(applicationSaveRes.body._id);
                        (applicationInfoRes.body.name).should.equal(application.name);
                        should.equal(applicationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Application.remove().exec(done);
    });
  });
});
