'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$sce', '$http', 'ApplicationsettingsService', 'CompaniesService', '$location', '$anchorScroll', '$sce',
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

    function makeHtml(str) {
      str = $sce.trustAsHtml(str);
    }
    $scope.viewCompany = function(company) {
      $scope.description = $sce.trustAsHtml(company.description);
      $scope.whyStudentSession = $sce.trustAsHtml(company.whyStudentSession);
      $scope.didYouKnow = $sce.trustAsHtml(company.didYouKnow);
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
      function sortByName (c1, c2) {
        return c1.name > c2.name ? 1 : -1;
      }
      vm.companies = response.data;
      vm.companies.sort(sortByName);
    }, function errorCallback(response) {
      console.log('ERROR: ' + response);
    });


  }
]);
