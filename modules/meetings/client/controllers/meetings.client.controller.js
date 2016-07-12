(function () {
  'use strict';

  // Meetings controller
  angular
    .module('meetings')
    .controller('MeetingsController', MeetingsController);

  MeetingsController.$inject = ['$scope', '$state', 'Authentication', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve'];

  function MeetingsController ($scope, $state, Authentication, meeting, facilities, applications, companies) {
    var vm = this;

    vm.authentication = Authentication;
    vm.meeting = meeting;
    vm.facilities = facilities;
    vm.applications = applications;
    vm.companies = companies;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Meeting
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.meeting.$remove($state.go('meetings.list'));
      }
    }

    // Save Meeting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.meetingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.meeting._id) {
        vm.meeting.$update(successCallback, errorCallback);
      } else {
        vm.meeting.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('meetings.view', {
          meetingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
