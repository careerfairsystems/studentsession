'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Facility = mongoose.model('Facility'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, facility;

/**
 * Facility routes tests
 */
describe('Facility CRUD tests', function () {

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

    // Save a user to the test db and create new Facility
    user.save(function () {
      facility = {
        name: 'Facility name'
      };

      done();
    });
  });

  it('should be able to save a Facility if logged in', function (done) {
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

        // Save a new Facility
        agent.post('/api/facilities')
          .send(facility)
          .expect(200)
          .end(function (facilitySaveErr, facilitySaveRes) {
            // Handle Facility save error
            if (facilitySaveErr) {
              return done(facilitySaveErr);
            }

            // Get a list of Facilities
            agent.get('/api/facilities')
              .end(function (facilitysGetErr, facilitysGetRes) {
                // Handle Facility save error
                if (facilitysGetErr) {
                  return done(facilitysGetErr);
                }

                // Get Facilities list
                var facilities = facilitysGetRes.body;

                // Set assertions
                (facilities[0].user._id).should.equal(userId);
                (facilities[0].name).should.match('Facility name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Facility if not logged in', function (done) {
    agent.post('/api/facilities')
      .send(facility)
      .expect(403)
      .end(function (facilitySaveErr, facilitySaveRes) {
        // Call the assertion callback
        done(facilitySaveErr);
      });
  });

  it('should not be able to save an Facility if no name is provided', function (done) {
    // Invalidate name field
    facility.name = '';

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

        // Save a new Facility
        agent.post('/api/facilities')
          .send(facility)
          .expect(400)
          .end(function (facilitySaveErr, facilitySaveRes) {
            // Set message assertion
            (facilitySaveRes.body.message).should.match('Please fill Facility name');

            // Handle Facility save error
            done(facilitySaveErr);
          });
      });
  });

  it('should be able to update an Facility if signed in', function (done) {
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

        // Save a new Facility
        agent.post('/api/facilities')
          .send(facility)
          .expect(200)
          .end(function (facilitySaveErr, facilitySaveRes) {
            // Handle Facility save error
            if (facilitySaveErr) {
              return done(facilitySaveErr);
            }

            // Update Facility name
            facility.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Facility
            agent.put('/api/facilities/' + facilitySaveRes.body._id)
              .send(facility)
              .expect(200)
              .end(function (facilityUpdateErr, facilityUpdateRes) {
                // Handle Facility update error
                if (facilityUpdateErr) {
                  return done(facilityUpdateErr);
                }

                // Set assertions
                (facilityUpdateRes.body._id).should.equal(facilitySaveRes.body._id);
                (facilityUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Facilities if not signed in', function (done) {
    // Create new Facility model instance
    var facilityObj = new Facility(facility);

    // Save the facility
    facilityObj.save(function () {
      // Request Facilities
      request(app).get('/api/facilities')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Facility if not signed in', function (done) {
    // Create new Facility model instance
    var facilityObj = new Facility(facility);

    // Save the Facility
    facilityObj.save(function () {
      request(app).get('/api/facilities/' + facilityObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', facility.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Facility with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/facilities/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Facility is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Facility which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Facility
    request(app).get('/api/facilities/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Facility with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Facility if signed in', function (done) {
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

        // Save a new Facility
        agent.post('/api/facilities')
          .send(facility)
          .expect(200)
          .end(function (facilitySaveErr, facilitySaveRes) {
            // Handle Facility save error
            if (facilitySaveErr) {
              return done(facilitySaveErr);
            }

            // Delete an existing Facility
            agent.delete('/api/facilities/' + facilitySaveRes.body._id)
              .send(facility)
              .expect(200)
              .end(function (facilityDeleteErr, facilityDeleteRes) {
                // Handle facility error error
                if (facilityDeleteErr) {
                  return done(facilityDeleteErr);
                }

                // Set assertions
                (facilityDeleteRes.body._id).should.equal(facilitySaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Facility if not signed in', function (done) {
    // Set Facility user
    facility.user = user;

    // Create new Facility model instance
    var facilityObj = new Facility(facility);

    // Save the Facility
    facilityObj.save(function () {
      // Try deleting Facility
      request(app).delete('/api/facilities/' + facilityObj._id)
        .expect(403)
        .end(function (facilityDeleteErr, facilityDeleteRes) {
          // Set message assertion
          (facilityDeleteRes.body.message).should.match('User is not authorized');

          // Handle Facility error error
          done(facilityDeleteErr);
        });

    });
  });

  it('should be able to get a single Facility that has an orphaned user reference', function (done) {
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

          // Save a new Facility
          agent.post('/api/facilities')
            .send(facility)
            .expect(200)
            .end(function (facilitySaveErr, facilitySaveRes) {
              // Handle Facility save error
              if (facilitySaveErr) {
                return done(facilitySaveErr);
              }

              // Set assertions on new Facility
              (facilitySaveRes.body.name).should.equal(facility.name);
              should.exist(facilitySaveRes.body.user);
              should.equal(facilitySaveRes.body.user._id, orphanId);

              // force the Facility to have an orphaned user reference
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

                    // Get the Facility
                    agent.get('/api/facilities/' + facilitySaveRes.body._id)
                      .expect(200)
                      .end(function (facilityInfoErr, facilityInfoRes) {
                        // Handle Facility error
                        if (facilityInfoErr) {
                          return done(facilityInfoErr);
                        }

                        // Set assertions
                        (facilityInfoRes.body._id).should.equal(facilitySaveRes.body._id);
                        (facilityInfoRes.body.name).should.equal(facility.name);
                        should.equal(facilityInfoRes.body.user, undefined);

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
      Facility.remove().exec(done);
    });
  });
});
