/* global $:false */
(function () {
  'use strict';

  // Meetings controller
  angular
    .module('meetings')
    .controller('MeetingsController', MeetingsController);

  MeetingsController.$inject = ['$scope', '$http', '$state', 'Authentication', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve', '$timeout'];

  function MeetingsController ($scope, $http, $state, Authentication, meeting, facilities, applications, companies, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.meeting = meeting;
    vm.facilities = facilities;
    vm.applications = applications;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.date = new Date('----', '--', '--', '--', '--', '--');
    vm.time = new Date('----', '--', '--', '--', '--', '--');
    vm.endDate = new Date('----', '--', '--', '--', '--', '--');
    vm.endTime = new Date('----', '--', '--', '--', '--', '--');


    $http({
      method: 'GET',
      url: '/api/companies/active'
    }).then(function successCallback(response) {
      vm.companies = response.data;
    }, function errorCallback(response) {
      console.log('ERROR: ' + response);
    });

    // Angular needs to complete rendering before applying 'chosen'
    $timeout(function () {
        // Chosen method
      $('.company_select_box').chosen({
        no_results_text: 'Oops, nothing found!',
        max_selected_options: 5,
        width: '100%'
      });
      $('.student_select_box').chosen({
        no_results_text: 'Oops, nothing found!',
        max_selected_options: 5,
        width: '100%'
      });
      $('.facility_select_box').chosen({
        no_results_text: 'Oops, nothing found!',
        max_selected_options: 5,
        width: '100%'
      });
    }, 0, false);

    vm.company = [];
    $('.company_select_box').on('change', function(evt, params) {
      var element = $('.company_select_box');
      if(params.selected){
        vm.company = vm.companies[params.selected];
      } else if(params.deselected) {
        vm.company = {};
      }
      console.log(vm.company);
    });


    vm.student = [];
    $('.student_select_box').on('change', function(evt, params) {
      var element = $('.student_select_box');
      if(params.selected){
        vm.student = vm.applications[params.selected];
      } else if(params.deselected) {
        vm.student = {};
      }
      console.log(vm.student);
    });

    vm.facility = [];
    $('.facility_select_box').on('change', function(evt, params) {
      var element = $('.facility_select_box');
      if(params.selected){
        vm.facility = vm.facilities[params.selected];
      } else if(params.deselected) {
        vm.facility = {};
      }
      console.log(vm.facility);
    });

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
