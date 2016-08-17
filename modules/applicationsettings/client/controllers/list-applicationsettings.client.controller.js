(function () {
  'use strict';

  angular
    .module('applicationsettings')
    .controller('ApplicationsettingsListController', ApplicationsettingsListController);

  ApplicationsettingsListController.$inject = ['ApplicationsettingsService'];

  function ApplicationsettingsListController(ApplicationsettingsService) {
    var vm = this;

    vm.applicationsettings = ApplicationsettingsService.query();
  }
})();
