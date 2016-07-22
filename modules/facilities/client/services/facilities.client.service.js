//Facilities service used to communicate Facilities REST endpoints
(function () {
  'use strict';

  angular
    .module('facilities')
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
