(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('MeetingsListController', MeetingsListController);

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

    /*getCurrentDate = function() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();

      if(dd<10) {
          dd='0'+dd
      } 

      if(mm<10) {
          mm='0'+mm
      } 

      return (today = yyyy+ '-' + mm + '-' + dd);
    }*/


    // takes the output from checkboxes and puts the values of the checked elements from a checkbox into an array
    $scope.chosenFacilitiesArray = function(checked){  
      var array=[];

      angular.forEach(checked,function(key,value){
        if(key)
          array.push(value);
      });
      return array;
    };


    $scope.createMeetings = function() {
      console.log('Att göra: skapa möten');
      //Att göra: skapa önskade möten
    };
  }})();
