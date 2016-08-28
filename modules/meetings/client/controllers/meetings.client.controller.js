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

    vm.date = new Date('----', '--', '--', '--', '--', '--');
    vm.time = new Date('----', '--', '--', '--', '--', '--');
    vm.endDate = new Date('----', '--', '--', '--', '--', '--');
    vm.endTime = new Date('----', '--', '--', '--', '--', '--');

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

      vm.meeting.facility = vm.facility;
      vm.meeting.company = vm.company;
      vm.meeting.student = vm.student;
      vm.meeting.date = new Date(vm.date.getFullYear(), vm.date.getMonth(), vm.date.getDate(), vm.time.getHours(), vm.time.getMinutes());
      vm.meeting.endDate = new Date(vm.endDate.getFullYear(), vm.endDate.getMonth(), vm.endDate.getDate(), vm.endTime.getHours(), vm.endTime.getMinutes());

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
