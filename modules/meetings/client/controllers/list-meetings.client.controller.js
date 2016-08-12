(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('MeetingsListController', MeetingsListController);

  MeetingsListController.$inject = ['$scope', 'MeetingsService', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve', 'Authentication'];

  function MeetingsListController($scope, MeetingsService, meeting, facilities, applications, companies, Authentication) {
    var vm = this;

    vm.meetings = MeetingsService.query();
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
    //TODO: Implement method to add many meetings with some coinstraints.

    // puts the chosen facilities into an array
    var chosenFacilitiesArray = function(){  
      var array=[];

      angular.forEach(vm.chosenFacilities, function(key,value){
        if(key)
          array.push(value);
      });
      return array;
    };


  /*  var startBeforeOrEndDate = function(start, end) {
      return start < end; //kolla timmar minuter osv.
    };*/

    var startNotAfterEndTime = function(start, end) {
      if(start.getHours() < end.getHours()){
        return true;
      } else if (start.getMinutes() <= end.getMinutes() && start.getHours() === end.getHours()) {
        return true;
      } else {
        return false;
      }
    };

    var createMeeting = function(facility, date) {
      var meeting = {};
      meeting.facility = facility;
      meeting.date = date;

      MeetingsService.post(meeting);
      console.log('Möte: ' + facility + ' ' + date);
    };

    var startNotAfterEndDate = function(start, end) {
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

    $scope.createMeetings = function() {
        var facilitiesArray = chosenFacilitiesArray();
       if(!!vm.startDate && !!vm.endDate && !!vm.startHours && !!vm.endHours && !!vm.lunchStart && !!vm.lunchEnd && facilitiesArray !== 'undefined' && vm.meetingTimeLength !== '' && facilitiesArray.length !== 0) {
          console.log('Alla fält är ifyllda');
         
          var date = vm.startDate;
          var time = vm.startHours; //ändras aldrig, kan lika gärna använda vm.startDate och vm.startHours
          var meetingDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes());
          
          while(startNotAfterEndDate(meetingDate, vm.endDate)){ 
           while(startNotAfterEndTime(new Date(meetingDate.getFullYear(), meetingDate.getMonth(), meetingDate.getDate(), meetingDate.getHours(), meetingDate.getMinutes() + vm.meetingTimeLength), vm.endHours)) {
              /*if( true){ //om det är lunch
                time = vm.lunchEnd;
              } else {*/
                //creating the current meeting  
                /*facilitiesArray.forEach(function(facility) {  //"Don't make functions within a loop." Hur lösa detta annorlunda, kolla upp.
                createMeeting(facility, meetingDate);
               });

                //updating the time to the next meeting time
                time = time.setMinutes(time.getMinutes() + vm.meetingTimeLength);
             /* } */

             createMeeting(facilitiesArray[0], meetingDate);
             meetingDate.setMinutes(meetingDate.getMinutes() + vm.meetingTimeLength);
            }
            //updating the date to the next day
            meetingDate.setDate(meetingDate.getDate() + 1);
            //reseting the time of the next day
            meetingDate.setHours(time.getHours());
            meetingDate.setMinutes(time.getMinutes());
            console.log('meetingDate: ', meetingDate);
          }
        } else {
          console.log('Alla fält är inte ifyllda!');
        } 
    };
  }
})();
