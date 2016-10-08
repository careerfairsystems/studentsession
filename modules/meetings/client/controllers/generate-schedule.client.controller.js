/* global $:false */
(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('GenerateScheduleController', GenerateScheduleController);

  GenerateScheduleController.$inject = ['$scope', 'MeetingsService', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve', 'Authentication', '$timeout'];

  function GenerateScheduleController($scope, MeetingsService, meeting, facilities, applications, companies, Authentication, $timeout) {
    var vm = this;

    //vm.meetings = MeetingsService.query();
    vm.facilities = facilities;
    vm.applications = applications;
    vm.companies = companies;

    // Examples of variables that are useful;
    vm.startDate = new Date('----', '--', '--', '--', '--', '--');
    vm.endDate = new Date('----', '--', '--', '--', '--', '--');
    vm.startHours = new Date('----', '--', '--', '--', '--', '--');
    vm.endHours = new Date('----', '--', '--', '--', '--', '--');
    vm.meetingTimeLength = '';
    vm.lunchStart = new Date('----', '--', '--', '--', '--', '--');
    vm.lunchEnd = new Date('----', '--', '--', '--', '--', '--');
    vm.chosenFacilities = [];

    // Chosen facilities?


    // Create meeting.
    var createMeeting = function(facility, date, endDate) {
      MeetingsService.post({
        facility: facility,
        date: date.toISOString(),
        endDate: endDate.toISOString()
      });
    };

    // Company dates.
    var startBeforeOrAtEndDate = function(start, end) {
      if(start.getFullYear() < end.getFullYear()){
        return true;
      } else if (start.getMonth() < end.getMonth() && start.getFullYear() === end.getFullYear()){
        return true;
      } else if (start.getDate() < end.getDate() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return true;
      } else if (start.getDate() === end.getDate() && start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        return true;
      } else {
        return false;
      }
    };

    // Company time.
    var startBeforeOrAtEndTime = function(start, end) { //testa med denna ändring!!
      if(start.getHours() < end.getHours()){
        return true;
      } else if (start.getMinutes() <= end.getMinutes() && start.getHours() === end.getHours()) {
        return true;
      } else if (start.getMinutes() === end.getMinutes() && start.getHours() === end.getHours()) {
        return true;
      } else {
        return false;
      }
    };

    // Company time reverse.
    var startAfterOrAtEndTime = function(start, end) {
      if(start.getHours() > end.getHours()){
        return true;
      } else if (start.getMinutes() >= end.getMinutes() && start.getHours() === end.getHours()) {
        return true;
      } else if (start.getMinutes() === end.getMinutes() && start.getHours() === end.getHours()) {
        return true;
      } else {
        return false;
      }
    };


    $scope.generateSchedule = function(){
     //TODO: Implement 




    };









































    $scope.createMeetings = function() {
      if(!!vm.startDate && !!vm.endDate && !!vm.startHours && !!vm.endHours && !!vm.lunchStart && !!vm.lunchEnd && vm.chosenFacilities !== 'undefined' && vm.meetingTimeLength !== '' && vm.chosenFacilities.length !== 0) {
        console.log('Alla fält är ifyllda');

        var meetingDate = new Date(vm.startDate.getFullYear(), vm.startDate.getMonth(), vm.startDate.getDate(), vm.startHours.getHours(), vm.startHours.getMinutes());
        var meetingEnd = new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate(), meetingDate.getHours(), meetingDate.getMinutes() + vm.meetingTimeLength);

        while(startBeforeOrAtEndDate(meetingDate, vm.endDate)){

          while(startBeforeOrAtEndTime(meetingEnd, vm.endHours)){

            if(!(startBeforeOrAtEndTime(meetingEnd, vm.lunchStart) ||
              startAfterOrAtEndTime(meetingDate, vm.lunchEnd))) {
              meetingDate.setHours(vm.lunchEnd.getHours());
              meetingDate.setMinutes(vm.lunchEnd.getMinutes());

              meetingEnd.setHours(vm.lunchEnd.getHours());
              meetingEnd.setMinutes(vm.lunchEnd.getMinutes() + vm.meetingTimeLength);
            }

            for (var i=0; i < vm.chosenFacilities.length; i++){
              createMeeting(vm.chosenFacilities[i], meetingDate, meetingEnd);
            }

            //updating the time to the next meeting time
            meetingDate.setMinutes(meetingDate.getMinutes() + vm.meetingTimeLength);
            meetingEnd.setMinutes(meetingDate.getMinutes() + vm.meetingTimeLength);
          }

          //updating the date to the next day
          meetingDate.setDate(meetingDate.getDate() + 1);
          //reseting the time of the next day
          meetingDate.setHours(vm.startHours.getHours());
          meetingDate.setMinutes(vm.startHours.getMinutes());

          //meeting end
          meetingEnd = new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate(), meetingDate.getHours(), meetingDate.getMinutes() + vm.meetingTimeLength);
        }

      } else {
        console.log('Alla fält är inte ifyllda!');
      }
    };
  }
})();
