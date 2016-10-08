(function () {
  'use strict';
 
  angular
     .module('meetings')
     .controller('MeetingsListController', MeetingsListController);
 
  MeetingsListController.$inject = ['MeetingsService'];
 
  function MeetingsListController(MeetingsService) {
    var vm = this;
 
    vm.meetings = MeetingsService.query();

    vm.deleteAllMeetings = function (){
      
      function deleteMeeting(m){
        var meeting = MeetingsService.get({ meetingId: m._id }, function() {
          meeting.$delete();
        });
      }
      vm.meetings.forEach(deleteMeeting);
      vm.meetings = [];
    };
  }
})();
