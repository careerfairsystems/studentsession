'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$sce', '$http', 'ApplicationsettingsService', 'CompaniesService', '$location', '$anchorScroll',
  function ($scope, Authentication, $sce, $http, ApplicationsettingsService, CompaniesService, $location, $anchorScroll) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    var vm = this;

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
      // Add again when settings completely working.
      //vm.frontpagehtml = $sce.trustAsHtml(response.data.frontpagehtml);
      console.log(response);
    }, function errorCallback(response) {
      console.log('ERROR: ' + response);
    });


    $http({
      method: 'GET',
      url: '/api/companies/active'
    }).then(function successCallback(response) {
      vm.companies = response.data;
    }, function errorCallback(response) {
      console.log('ERROR: ' + response);
    });


  }
]);
