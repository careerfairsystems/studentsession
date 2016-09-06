'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$sce', '$http', 'ApplicationsettingsService', 'CompaniesService', '$location', '$anchorScroll',
  function ($scope, Authentication, $sce, $http, ApplicationsettingsService, CompaniesService, $location, $anchorScroll) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var vm = this;

    vm.companies = CompaniesService.query();

    $scope.gotoSelected = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('company');

      // call $anchorScroll()
      $anchorScroll();
    };

    $scope.viewCompany = function(company) {
      $scope.company = company; // Company is the selected one.
      $scope.gotoSelected();
    };
    $http({
      method: 'GET',
      url: '/api/applicationsettings/active'
    }).then(function successCallback(response) {
      vm.frontpagehtml = $sce.trustAsHtml(response.data.frontpagehtml);

      console.log(response);
    }, function errorCallback(response) {
      console.log('ERROR: ' + response);
    });

  }
]);
