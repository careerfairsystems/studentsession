(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('MultipleMeetingsController', MultipleMeetingsController);

  MultipleMeetingsController.$inject = ['$scope', 'MeetingsService', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve', 'Authentication'];

  function MultipleMeetingsController($scope, MeetingsService, meeting, facilities, applications, companies, Authentication) {
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

    // puts the chosen facilities into an array
    var chosenFacilitiesArray = function(){  
      var array=[];

      angular.forEach(vm.chosenFacilities, function(key,value){
        if(key)
          array.push(value);
      });
      return array;
    };

    var createMeeting = function(facility, date) {
      var meeting = {};
      meeting.facility = facility;
      meeting.date = date.toISOString();

      MeetingsService.post(meeting);
      console.log('Möte: ' + facility + ' ' + date);
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
      var facilitiesArray = chosenFacilitiesArray();
      if(!!vm.startDate && !!vm.endDate && !!vm.startHours && !!vm.endHours && !!vm.lunchStart && !!vm.lunchEnd && facilitiesArray !== 'undefined' && vm.meetingTimeLength !== '' && facilitiesArray.length !== 0) {
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

            for (var i=0; i < facilitiesArray.length; i++){
              createMeeting(facilitiesArray[i], meetingDate);
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
