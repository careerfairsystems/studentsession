(function () {
  'use strict';

  angular
    .module('meetings')
    .factory('FacilitiesService', FacilitiesService);

  FacilitiesService.$inject = ['$resource'];

  function FacilitiesService($resource) {
    return $resource('api/facilities/:facilityId', {
      facilityId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
