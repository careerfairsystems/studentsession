(function () {
  'use strict';

  angular
    .module('facilities')
    .controller('FacilitiesListController', FacilitiesListController);

  FacilitiesListController.$inject = ['FacilitiesService'];

  function FacilitiesListController(FacilitiesService) {
    var vm = this;

    vm.facilities = FacilitiesService.query();
  }
})();
