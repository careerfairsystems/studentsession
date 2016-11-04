/*global $:false */
(function () {
  'use strict';

  angular
    .module('companies')
    .controller('ExportScheduleController', ExportScheduleController);

  ExportScheduleController.$inject = ['CompaniesService', '$scope', '$compile', '$window', '$timeout', 'ApplicationsService'];

  function ExportScheduleController(CompaniesService, $scope, $compile, $window, $timeout, ApplicationsService) {
    var vm = this;

    vm.companies = CompaniesService.query(function(data) {
      vm.companies = data;
      vm.meetings = [];
      data.forEach(extractMeetingsFromCompany);
      function extractMeetingsFromCompany(c){
        c.meetings.forEach(extract);
        function extract(m){ 
          vm.meetings.push({
            company: c.name,
            student: m.student.name,
            start: m.startTime,
            end: m.endTime,
            day: m.day
          });
        }
      }
      // Datatable code
      // Setup - add a text input to each first header row cell
      $('#meetingTable thead tr:first th').each(function (index) {
        var title = $(this).text();
        var pos = index ;
        $(this).html('<input class"form-control" id="col-search-'+pos+'" type="text" placeholder="Search '+title+'" />');
      });  
      vm.createMeetingDatatable(vm.meetings);

      getApplications();
    });

    // Create Datatable
    vm.createMeetingDatatable = function(data){
      vm.table = $('#meetingTable').DataTable({
        dom: 'Bfrtip',
        scrollX: true,
        scrollCollapse: true,
        autoWidth: false,
        paging: false,
        stateSave: true,
        buttons: [
          'copy', 'excel', 'pdf', 'colvis'
        ],
        data: data,
        'order': [[ 1, 'asc' ]],
        columns: [
          { data: 'company' },
          { data: 'student' },
          { data: 'day' },
          { data: 'start' },
          { data: 'end' },
        ]
      });
            
      // Apply the search
      vm.table.columns().every(function (index) {
        var that = this;
        $('input#col-search-'+index).on('keyup change', function () {
          if (that.search() !== this.value) {
            that.search(this.value).draw();
          }
        });
      });
    };

    function getApplications(){
      vm.applications = ApplicationsService.query(function(data) {
        vm.applications = data;

        // Get all reserves
        vm.reserves = vm.applications.filter(isReserve);
        function isReserve(a){
          var length = vm.companies.filter(chooseStudent).length;
          return length === 0;
          function chooseStudent(company){
            var length = company.meetings.filter(sameStudent).length;
            return length > 0;
            function sameStudent(m){ 
              return m.student.id === a._id; 
            }
          }
        }

        vm.reserves.forEach(getTimes);
        function getTimes(r){
          r.wed = r.times[0].hour;
          r.thur = r.times[1].hour;
          r.wed = r.wed ? r.wed : [];
          r.thur = r.thur ? r.thur : [];
        }


        // Datatable code
        // Setup - add a text input to each first header row cell
        $('#reservesTable thead tr:first th').each(function (index) {
          var title = $(this).text();
          var pos = index ;
          $(this).html('<input class"form-control" id="col-search-'+pos+'" type="text" placeholder="Search '+title+'" />');
        });  
        vm.createReservesTable(vm.reserves);
      });
    }
    // Create Datatable
    vm.createReservesTable = function(data){
      vm.table = $('#reservesTable').DataTable({
        dom: 'Bfrtip',
        scrollX: true,
        scrollCollapse: true,
        autoWidth: false,
        paging: false,
        stateSave: true,
        buttons: [
          'copy', 'excel', 'pdf', 'colvis'
        ],
        data: data,
        'order': [[ 1, 'asc' ]],
        columns: [
          { data: 'name' },
          { data: 'phone' },
          { data: 'email' },
          { data: 'wed' },
          { data: 'thur' },
        ]
      });
            
      // Apply the search
      vm.table.columns().every(function (index) {
        var that = this;
        $('input#col-search-'+index).on('keyup change', function () {
          if (that.search() !== this.value) {
            that.search(this.value).draw();
          }
        });
      });
    };



  }
})();
