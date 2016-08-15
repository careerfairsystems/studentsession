(function () {
   'use strict';
 
   angular
     .module('meetings')
     .controller('MeetingsListController', MeetingsListController);
 
   MeetingsListController.$inject = ['MeetingsService'];
 
   function MeetingsListController(MeetingsService) {
     var vm = this;
 
     vm.meetings = MeetingsService.query();
   }
 })();