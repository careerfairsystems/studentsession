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
    vm.startDate = "2016-11-16";
    vm.endDate = "2016-11-16";
    vm.startHours = "";
    vm.endHours = "";
    vm.meetingTimeLength = "";
    //TODO: Implement method to add many meetings with some coinstraints.

    $scope.chosenFacilities = {};

    // takes the output from checkboxes and puts the values of the checked elements from a checkbox into an array
    $scope.chosenFacilitiesArray = function(checked){  
      var array=[];

      angular.forEach(checked,function(key,value){
        if(key)
           array.push(value)
      })
      return array;
    };
}})();
