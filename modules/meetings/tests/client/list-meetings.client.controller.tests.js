(function () {
  'use strict';

  describe('Meetings List Controller Tests', function () {
    // Initialize global variables
    var MeetingsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      MeetingsService,
      mockMeeting;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _MeetingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      MeetingsService = _MeetingsService_;

      // create mock article
      mockMeeting = new MeetingsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Meeting Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Meetings List controller.
      MeetingsListController = $controller('MeetingsListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockMeetingList;

      beforeEach(function () {
        mockMeetingList = [mockMeeting, mockMeeting];
      });

      it('should send a GET request and return all Meetings', inject(function (MeetingsService) {
        // Set POST response
        $httpBackend.expectGET('api/meetings').respond(mockMeetingList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.meetings.length).toEqual(2);
        expect($scope.vm.meetings[0]).toEqual(mockMeeting);
        expect($scope.vm.meetings[1]).toEqual(mockMeeting);

      }));
    });
  });
})();
