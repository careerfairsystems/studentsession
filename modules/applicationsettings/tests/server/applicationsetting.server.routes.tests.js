'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Applicationsetting = mongoose.model('Applicationsetting'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, applicationsetting;

/**
 * Applicationsetting routes tests
 */
describe('Applicationsetting CRUD tests', function () {

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

    // Save a user to the test db and create new Applicationsetting
    user.save(function () {
      applicationsetting = {
        name: 'Applicationsetting name'
      };

      done();
    });
  });

  it('should be able to save a Applicationsetting if logged in', function (done) {
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

        // Save a new Applicationsetting
        agent.post('/api/applicationsettings')
          .send(applicationsetting)
          .expect(200)
          .end(function (applicationsettingSaveErr, applicationsettingSaveRes) {
            // Handle Applicationsetting save error
            if (applicationsettingSaveErr) {
              return done(applicationsettingSaveErr);
            }

            // Get a list of Applicationsettings
            agent.get('/api/applicationsettings')
              .end(function (applicationsettingsGetErr, applicationsettingsGetRes) {
                // Handle Applicationsetting save error
                if (applicationsettingsGetErr) {
                  return done(applicationsettingsGetErr);
                }

                // Get Applicationsettings list
                var applicationsettings = applicationsettingsGetRes.body;

                // Set assertions
                (applicationsettings[0].user._id).should.equal(userId);
                (applicationsettings[0].name).should.match('Applicationsetting name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Applicationsetting if not logged in', function (done) {
    agent.post('/api/applicationsettings')
      .send(applicationsetting)
      .expect(403)
      .end(function (applicationsettingSaveErr, applicationsettingSaveRes) {
        // Call the assertion callback
        done(applicationsettingSaveErr);
      });
  });

  it('should not be able to save an Applicationsetting if no name is provided', function (done) {
    // Invalidate name field
    applicationsetting.name = '';

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

        // Save a new Applicationsetting
        agent.post('/api/applicationsettings')
          .send(applicationsetting)
          .expect(400)
          .end(function (applicationsettingSaveErr, applicationsettingSaveRes) {
            // Set message assertion
            (applicationsettingSaveRes.body.message).should.match('Please fill Applicationsetting name');

            // Handle Applicationsetting save error
            done(applicationsettingSaveErr);
          });
      });
  });

  it('should be able to update an Applicationsetting if signed in', function (done) {
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

        // Save a new Applicationsetting
        agent.post('/api/applicationsettings')
          .send(applicationsetting)
          .expect(200)
          .end(function (applicationsettingSaveErr, applicationsettingSaveRes) {
            // Handle Applicationsetting save error
            if (applicationsettingSaveErr) {
              return done(applicationsettingSaveErr);
            }

            // Update Applicationsetting name
            applicationsetting.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Applicationsetting
            agent.put('/api/applicationsettings/' + applicationsettingSaveRes.body._id)
              .send(applicationsetting)
              .expect(200)
              .end(function (applicationsettingUpdateErr, applicationsettingUpdateRes) {
                // Handle Applicationsetting update error
                if (applicationsettingUpdateErr) {
                  return done(applicationsettingUpdateErr);
                }

                // Set assertions
                (applicationsettingUpdateRes.body._id).should.equal(applicationsettingSaveRes.body._id);
                (applicationsettingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Applicationsettings if not signed in', function (done) {
    // Create new Applicationsetting model instance
    var applicationsettingObj = new Applicationsetting(applicationsetting);

    // Save the applicationsetting
    applicationsettingObj.save(function () {
      // Request Applicationsettings
      request(app).get('/api/applicationsettings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Applicationsetting if not signed in', function (done) {
    // Create new Applicationsetting model instance
    var applicationsettingObj = new Applicationsetting(applicationsetting);

    // Save the Applicationsetting
    applicationsettingObj.save(function () {
      request(app).get('/api/applicationsettings/' + applicationsettingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', applicationsetting.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Applicationsetting with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/applicationsettings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Applicationsetting is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Applicationsetting which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Applicationsetting
    request(app).get('/api/applicationsettings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Applicationsetting with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Applicationsetting if signed in', function (done) {
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

        // Save a new Applicationsetting
        agent.post('/api/applicationsettings')
          .send(applicationsetting)
          .expect(200)
          .end(function (applicationsettingSaveErr, applicationsettingSaveRes) {
            // Handle Applicationsetting save error
            if (applicationsettingSaveErr) {
              return done(applicationsettingSaveErr);
            }

            // Delete an existing Applicationsetting
            agent.delete('/api/applicationsettings/' + applicationsettingSaveRes.body._id)
              .send(applicationsetting)
              .expect(200)
              .end(function (applicationsettingDeleteErr, applicationsettingDeleteRes) {
                // Handle applicationsetting error error
                if (applicationsettingDeleteErr) {
                  return done(applicationsettingDeleteErr);
                }

                // Set assertions
                (applicationsettingDeleteRes.body._id).should.equal(applicationsettingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Applicationsetting if not signed in', function (done) {
    // Set Applicationsetting user
    applicationsetting.user = user;

    // Create new Applicationsetting model instance
    var applicationsettingObj = new Applicationsetting(applicationsetting);

    // Save the Applicationsetting
    applicationsettingObj.save(function () {
      // Try deleting Applicationsetting
      request(app).delete('/api/applicationsettings/' + applicationsettingObj._id)
        .expect(403)
        .end(function (applicationsettingDeleteErr, applicationsettingDeleteRes) {
          // Set message assertion
          (applicationsettingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Applicationsetting error error
          done(applicationsettingDeleteErr);
        });

    });
  });

  it('should be able to get a single Applicationsetting that has an orphaned user reference', function (done) {
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

          // Save a new Applicationsetting
          agent.post('/api/applicationsettings')
            .send(applicationsetting)
            .expect(200)
            .end(function (applicationsettingSaveErr, applicationsettingSaveRes) {
              // Handle Applicationsetting save error
              if (applicationsettingSaveErr) {
                return done(applicationsettingSaveErr);
              }

              // Set assertions on new Applicationsetting
              (applicationsettingSaveRes.body.name).should.equal(applicationsetting.name);
              should.exist(applicationsettingSaveRes.body.user);
              should.equal(applicationsettingSaveRes.body.user._id, orphanId);

              // force the Applicationsetting to have an orphaned user reference
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

                    // Get the Applicationsetting
                    agent.get('/api/applicationsettings/' + applicationsettingSaveRes.body._id)
                      .expect(200)
                      .end(function (applicationsettingInfoErr, applicationsettingInfoRes) {
                        // Handle Applicationsetting error
                        if (applicationsettingInfoErr) {
                          return done(applicationsettingInfoErr);
                        }

                        // Set assertions
                        (applicationsettingInfoRes.body._id).should.equal(applicationsettingSaveRes.body._id);
                        (applicationsettingInfoRes.body.name).should.equal(applicationsetting.name);
                        should.equal(applicationsettingInfoRes.body.user, undefined);

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
      Applicationsetting.remove().exec(done);
    });
  });
});
