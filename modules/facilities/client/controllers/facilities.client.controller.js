(function () {
  'use strict';

  // Facilities controller
  angular
    .module('facilities')
    .controller('FacilitiesController', FacilitiesController);

  FacilitiesController.$inject = ['$scope', '$state', 'Authentication', 'facilityResolve'];

  function FacilitiesController ($scope, $state, Authentication, facility) {
    var vm = this;

    vm.authentication = Authentication;
    vm.facility = facility;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Facility
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.facility.$remove($state.go('facilities.list'));
      }
    }

    // Save Facility
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.facilityForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.facility._id) {
        vm.facility.$update(successCallback, errorCallback);
      } else {
        vm.facility.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('facilities.view', {
          facilityId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
