(function () {
  'use strict';

  angular
    .module('meetings')
    .controller('MeetingsListController', MeetingsListController);

  MeetingsListController.$inject = ['MeetingsService', 'meetingResolve', 'listFacilitiesResolve', 'listApplicationsResolve', 'listCompaniesResolve'];

  function MeetingsListController(MeetingsService, meeting, facilities, applications, companies) {
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



  }
})();
