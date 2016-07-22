'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Meeting = mongoose.model('Meeting'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, meeting;

/**
 * Meeting routes tests
 */
describe('Meeting CRUD tests', function () {

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

    // Save a user to the test db and create new Meeting
    user.save(function () {
      meeting = {
        name: 'Meeting name'
      };

      done();
    });
  });

  it('should be able to save a Meeting if logged in', function (done) {
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

        // Save a new Meeting
        agent.post('/api/meetings')
          .send(meeting)
          .expect(200)
          .end(function (meetingSaveErr, meetingSaveRes) {
            // Handle Meeting save error
            if (meetingSaveErr) {
              return done(meetingSaveErr);
            }

            // Get a list of Meetings
            agent.get('/api/meetings')
              .end(function (meetingsGetErr, meetingsGetRes) {
                // Handle Meeting save error
                if (meetingsGetErr) {
                  return done(meetingsGetErr);
                }

                // Get Meetings list
                var meetings = meetingsGetRes.body;

                // Set assertions
                (meetings[0].user._id).should.equal(userId);
                (meetings[0].name).should.match('Meeting name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Meeting if not logged in', function (done) {
    agent.post('/api/meetings')
      .send(meeting)
      .expect(403)
      .end(function (meetingSaveErr, meetingSaveRes) {
        // Call the assertion callback
        done(meetingSaveErr);
      });
  });

  it('should not be able to save an Meeting if no name is provided', function (done) {
    // Invalidate name field
    meeting.name = '';

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

        // Save a new Meeting
        agent.post('/api/meetings')
          .send(meeting)
          .expect(400)
          .end(function (meetingSaveErr, meetingSaveRes) {
            // Set message assertion
            (meetingSaveRes.body.message).should.match('Please fill Meeting name');

            // Handle Meeting save error
            done(meetingSaveErr);
          });
      });
  });

  it('should be able to update an Meeting if signed in', function (done) {
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

        // Save a new Meeting
        agent.post('/api/meetings')
          .send(meeting)
          .expect(200)
          .end(function (meetingSaveErr, meetingSaveRes) {
            // Handle Meeting save error
            if (meetingSaveErr) {
              return done(meetingSaveErr);
            }

            // Update Meeting name
            meeting.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Meeting
            agent.put('/api/meetings/' + meetingSaveRes.body._id)
              .send(meeting)
              .expect(200)
              .end(function (meetingUpdateErr, meetingUpdateRes) {
                // Handle Meeting update error
                if (meetingUpdateErr) {
                  return done(meetingUpdateErr);
                }

                // Set assertions
                (meetingUpdateRes.body._id).should.equal(meetingSaveRes.body._id);
                (meetingUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Meetings if not signed in', function (done) {
    // Create new Meeting model instance
    var meetingObj = new Meeting(meeting);

    // Save the meeting
    meetingObj.save(function () {
      // Request Meetings
      request(app).get('/api/meetings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Meeting if not signed in', function (done) {
    // Create new Meeting model instance
    var meetingObj = new Meeting(meeting);

    // Save the Meeting
    meetingObj.save(function () {
      request(app).get('/api/meetings/' + meetingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', meeting.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Meeting with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/meetings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Meeting is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Meeting which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Meeting
    request(app).get('/api/meetings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Meeting with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Meeting if signed in', function (done) {
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

        // Save a new Meeting
        agent.post('/api/meetings')
          .send(meeting)
          .expect(200)
          .end(function (meetingSaveErr, meetingSaveRes) {
            // Handle Meeting save error
            if (meetingSaveErr) {
              return done(meetingSaveErr);
            }

            // Delete an existing Meeting
            agent.delete('/api/meetings/' + meetingSaveRes.body._id)
              .send(meeting)
              .expect(200)
              .end(function (meetingDeleteErr, meetingDeleteRes) {
                // Handle meeting error error
                if (meetingDeleteErr) {
                  return done(meetingDeleteErr);
                }

                // Set assertions
                (meetingDeleteRes.body._id).should.equal(meetingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Meeting if not signed in', function (done) {
    // Set Meeting user
    meeting.user = user;

    // Create new Meeting model instance
    var meetingObj = new Meeting(meeting);

    // Save the Meeting
    meetingObj.save(function () {
      // Try deleting Meeting
      request(app).delete('/api/meetings/' + meetingObj._id)
        .expect(403)
        .end(function (meetingDeleteErr, meetingDeleteRes) {
          // Set message assertion
          (meetingDeleteRes.body.message).should.match('User is not authorized');

          // Handle Meeting error error
          done(meetingDeleteErr);
        });

    });
  });

  it('should be able to get a single Meeting that has an orphaned user reference', function (done) {
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

          // Save a new Meeting
          agent.post('/api/meetings')
            .send(meeting)
            .expect(200)
            .end(function (meetingSaveErr, meetingSaveRes) {
              // Handle Meeting save error
              if (meetingSaveErr) {
                return done(meetingSaveErr);
              }

              // Set assertions on new Meeting
              (meetingSaveRes.body.name).should.equal(meeting.name);
              should.exist(meetingSaveRes.body.user);
              should.equal(meetingSaveRes.body.user._id, orphanId);

              // force the Meeting to have an orphaned user reference
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

                    // Get the Meeting
                    agent.get('/api/meetings/' + meetingSaveRes.body._id)
                      .expect(200)
                      .end(function (meetingInfoErr, meetingInfoRes) {
                        // Handle Meeting error
                        if (meetingInfoErr) {
                          return done(meetingInfoErr);
                        }

                        // Set assertions
                        (meetingInfoRes.body._id).should.equal(meetingSaveRes.body._id);
                        (meetingInfoRes.body.name).should.equal(meeting.name);
                        should.equal(meetingInfoRes.body.user, undefined);

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
      Meeting.remove().exec(done);
    });
  });
});
