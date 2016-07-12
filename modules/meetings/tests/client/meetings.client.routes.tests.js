(function () {
  'use strict';

  describe('Meetings Route Tests', function () {
    // Initialize global variables
    var $scope,
      MeetingsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MeetingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MeetingsService = _MeetingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('meetings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/meetings');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MeetingsController,
          mockMeeting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('meetings.view');
          $templateCache.put('modules/meetings/client/views/view-meeting.client.view.html', '');

          // create mock Meeting
          mockMeeting = new MeetingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Meeting Name'
          });

          //Initialize Controller
          MeetingsController = $controller('MeetingsController as vm', {
            $scope: $scope,
            meetingResolve: mockMeeting
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:meetingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.meetingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            meetingId: 1
          })).toEqual('/meetings/1');
        }));

        it('should attach an Meeting to the controller scope', function () {
          expect($scope.vm.meeting._id).toBe(mockMeeting._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/meetings/client/views/view-meeting.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MeetingsController,
          mockMeeting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('meetings.create');
          $templateCache.put('modules/meetings/client/views/form-meeting.client.view.html', '');

          // create mock Meeting
          mockMeeting = new MeetingsService();

          //Initialize Controller
          MeetingsController = $controller('MeetingsController as vm', {
            $scope: $scope,
            meetingResolve: mockMeeting
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.meetingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/meetings/create');
        }));

        it('should attach an Meeting to the controller scope', function () {
          expect($scope.vm.meeting._id).toBe(mockMeeting._id);
          expect($scope.vm.meeting._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/meetings/client/views/form-meeting.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MeetingsController,
          mockMeeting;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('meetings.edit');
          $templateCache.put('modules/meetings/client/views/form-meeting.client.view.html', '');

          // create mock Meeting
          mockMeeting = new MeetingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Meeting Name'
          });

          //Initialize Controller
          MeetingsController = $controller('MeetingsController as vm', {
            $scope: $scope,
            meetingResolve: mockMeeting
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:meetingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.meetingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            meetingId: 1
          })).toEqual('/meetings/1/edit');
        }));

        it('should attach an Meeting to the controller scope', function () {
          expect($scope.vm.meeting._id).toBe(mockMeeting._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/meetings/client/views/form-meeting.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
