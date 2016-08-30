(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompaniesListController', CompaniesListController);

  CompaniesListController.$inject = ['CompaniesService', '$scope','$location', '$anchorScroll'];

  function CompaniesListController(CompaniesService, $scope, $location, $anchorScroll) {
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
  }
})();
