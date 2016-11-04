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

        vm.applications = vm.applications.reduce(convertToCompanyApplications, []);
        function convertToCompanyApplications(pre, curr){
          return pre.concat(getCompanyApplications(curr));
        }
        function getCompanyApplications(application){
          // Get application times
          application.wed = application.times[0].hour;
          application.thur = application.times[1].hour;
          application.wed = application.wed ? application.wed : [];
          application.thur = application.thur ? application.thur : [];
          
          var arr = [];
          application.companies.forEach(companiesIterator);
          function companiesIterator(c){
            arr.push({ 
              _id: application._id, 
              company: c.name, 
              student: application.name, 
              email: application.email,
              phone: application.phone,
              wed: application.wed,
              thur: application.thur,
            });
          }
          return arr;
        }

        // Get all application
        vm.applications.forEach(isReserve);
        function isReserve(a){
          var companies = vm.companies.filter(sameCompany);
          function sameCompany(c){ return c.name === a.company; }
          if(companies.length === 0){
            a.chosen = 'CompanyError';
          }
          var company = companies[0];
          var meetings = company.meetings.filter(sameStudent);
          function sameStudent(m){ 
            return m.student.id === a._id; 
          }
          if(meetings.length > 0){
            a.chosen = meetings[0].day + ' ' + meetings[0].startTime + '-' + meetings[0].endTime;
            a.forced = meetings[0].forced;
          } else {
            a.chosen = 'Reserve';
            a.forced = false;
          }
        }


        // Datatable code
        // Setup - add a text input to each first header row cell
        $('#reservesTable thead tr:first th').each(function (index) {
          var title = $(this).text();
          var pos = index ;
          $(this).html('<input class"form-control" id="col-search-'+pos+'" type="text" placeholder="Search '+title+'" />');
        });  
        vm.createApplicationsTable(vm.applications);
      });
    }
    // Create Datatable
    vm.createApplicationsTable = function(data){
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
          { data: 'company' },
          { data: 'student' },
          { data: 'chosen' },
          { data: 'forced' },
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
