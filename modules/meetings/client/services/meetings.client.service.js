//Meetings service used to communicate Meetings REST endpoints
(function () {
  'use strict';

  angular
    .module('meetings')
    .factory('MeetingsService', MeetingsService);

  MeetingsService.$inject = ['$resource'];

  function MeetingsService($resource) {
    return $resource('api/meetings/:meetingId', {
      meetingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
