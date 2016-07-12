(function () {
  'use strict';

  angular
    .module('meetings')
    .factory('CompaniesService', CompaniesService);

  CompaniesService.$inject = ['$resource'];

  function CompaniesService($resource) {
    return $resource('api/companies/:companyId', {
      companyId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
