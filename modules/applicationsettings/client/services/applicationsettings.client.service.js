//Applicationsettings service used to communicate Applicationsettings REST endpoints
(function () {
  'use strict';

  angular
    .module('applicationsettings')
    .factory('ApplicationsettingsService', ApplicationsettingsService);

  ApplicationsettingsService.$inject = ['$resource'];

  function ApplicationsettingsService($resource) {
    return $resource('api/applicationsettings/:applicationsettingId', {
      applicationsettingId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      getactive: {
        method: 'GET',
        isArray: true
      }
    });
  }
})();
