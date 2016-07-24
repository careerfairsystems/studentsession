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
        if(!!vm.startDate && !!vm.endDate && !!vm.startHours && !!vm.endHours && !!vm.lunchStart && !!vm.lunchEnd && facilitiesArray !== 'undefined' && vm.meetingTimeLength !== "" && facilitiesArray.length !== 0) {
          console.log('Alla fält är ifyllda');
        } else {
          console.log('Alla fält är inte ifyllda!');
        } 
    };
  }})();
