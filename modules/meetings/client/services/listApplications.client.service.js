(function () {
  'use strict';

  angular
    .module('meetings')
    .factory('ApplicationsService', ApplicationsService);

  ApplicationsService.$inject = ['$resource'];

  function ApplicationsService($resource) {
    return $resource('api/applications/:applicationId', {
      applicationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
