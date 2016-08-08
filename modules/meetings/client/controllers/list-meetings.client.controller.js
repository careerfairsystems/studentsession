(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('MeetingsListController', MeetingsListController)
    .directive('datepickerLocaldate', ['$parse', function ($parse) {
     var directive = {
       restrict: 'A',
       require: ['ngModel'],
       link: link
     };
     return directive;

     function link(scope, element, attr, ctrls) {
       var ngModelController = ctrls[0];

         // called with a JavaScript Date object when picked from the datepicker
       ngModelController.$parsers.push(function (viewValue) {
         console.log(viewValue);console.log(viewValue);console.log(viewValue);
             // undo the timezone adjustment we did during the formatting
         viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
             // we just want a local date in ISO format
         return viewValue.toISOString().substring(0, 10);
       });
     }
    }]);

  MeetingsListController.$inject = ['$scope', 'MeetingsService', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve'];

  function MeetingsListController($scope, MeetingsService, meeting, facilities, applications, companies) {
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

      angular.forEach(vm.chosenFacilities,function(key,value){
        if(key)
          array.push(value);
      });
      return array;
    };

    $scope.createMeetings = function() {
        var facilitiesArray = chosenFacilitiesArray();
        if(!!vm.startDate && !!vm.endDate && !!vm.startHours && !!vm.endHours && !!vm.lunchStart && !!vm.lunchEnd && facilitiesArray !== 'undefined' && vm.meetingTimeLength !== '' && facilitiesArray.length !== 0) {
          console.log('Alla fält är ifyllda');

          var meetingDate;
          var date = vm.startDate;
          var time = vm.startHours;
         while(date <= vm.endDate){
            while(startBeforeEndTime(time.getMinutes + vm.meetingTimeLength, vm.endHours)){
              //skapande av ett Date med rätt datum och tid
              meetingDate = new Date(date.getFullYear, date.getMonth+1, date.getDate+1, time.getHours, time.getMinutes);

              if( true/*det är lunchtid*/){
                time = vm.lunchEnd;
              } else {
                //creating the current meeting  
                facilitiesArray.forEach(function(facility) {
                createMeeting(facility, meetingDate);
               });

                //updating the time to the next meeting time
                time = time.setMinutes(time.getMinutes() + vm.meetingTimeLength);
              }
            }
            //updating the date to the next day 
            date = new Date(date.setDate(date.getDate() + 1));
          }
        } else {
          console.log('Alla fält är inte ifyllda!');
        } 
    };

    var startBeforeEndDate = function(start, end) {
      return start < end;
    };

    var startBeforeEndTime = function(start, end) {
      if(start.getHours < end.getHours){
        return true;
      } else if ((start.getMinutes < end.getMinutes) && (start.getHours = end.getHours)){
        return true;
      } else {
        return false;
      }
    };

    var createMeeting = function(facility, date) {
      //todo
    };
  }})();
