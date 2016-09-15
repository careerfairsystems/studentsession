(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('MultipleMeetingsController', MultipleMeetingsController);

  MultipleMeetingsController.$inject = ['$scope', 'MeetingsService', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve', 'Authentication', '$timeout'];

  function MultipleMeetingsController($scope, MeetingsService, meeting, facilities, applications, companies, Authentication, $timeout) {
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
    vm.chosenFacilities = {};

    $timeout(function () {
        // Chosen methods
      $(".facility_select_box").chosen({
        no_results_text: "Oops, nothing found!",
        max_selected_options: 5,
        width: "100%"
      });
    }, 0, false);

    vm.chosenFacilities = [];
    $('.facility_select_box').on('change', function(evt, params) {
      var element = $('.facility_select_box');
      if(params.selected){
        vm.chosenFacilities.push(vm.facilities[params.selected]);
      } else if(params.deselected) {
        var position = vm.chosenFacilities.indexOf(vm.companies[params.deselected]);
        vm.chosenFacilities.splice(position, 1);
      }
      console.log(vm.chosenFacilities);
    });

    // puts the chosen facilities into an array
    //var chosenFacilitiesArray = function(){
    //  var array=[];
    //
    //  angular.forEach(vm.chosenFacilities, function(key,value){
    //    if(key)
    //      array.push(value);
    //  });
    //  return array;
    //};

    var createMeeting = function(facility, date, endDate) {
      var meeting = {};
      meeting.facility = facility;
      meeting.date = date.toISOString();
      meeting.endDate = endDate.toISOString();

      MeetingsService.post(meeting);
      console.log('Möte: ' + facility + ' ' + date + endDate);
    };

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
