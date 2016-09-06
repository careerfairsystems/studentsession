(function () {
  'use strict';

  angular
    .module('applicationsettings')
    .controller('ActiveApplicationsettingsController', ActiveApplicationsettingsController);

  ActiveApplicationsettingsController.$inject = ['ApplicationsettingsService', 'settingListResolve', '$scope', '$location', '$anchorScroll'];

  function ActiveApplicationsettingsController(ApplicationsettingsService, settings, $scope, $location, $anchorScroll) {
    var vm = this;
    vm.settings = settings;

    $scope.gotoSelected = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('setting');

      // call $anchorScroll()
      $anchorScroll();
    };

    $scope.viewSetting = function(setting) {
      $scope.setting = setting; // Setting is the selected one.
      $scope.gotoSelected();
    };

    $scope.setActive = function(setting) {
      angular.forEach(settings, function(s) {
        if(setting.name === s.name) {
          s.active = true;
          ApplicationsettingsService.update(s);
        } else {
          s.active = false;
          ApplicationsettingsService.update(s);
        }
      });
    };
  }
})();
