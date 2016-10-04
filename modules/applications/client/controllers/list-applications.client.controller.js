/*global $:false */
'use strict';
(function () {

  angular
    .module('applications')
    .controller('ApplicationsListController', ApplicationsListController);

  ApplicationsListController.$inject = ['ApplicationsService', '$state', '$filter', '$scope', '$compile'];

  function ApplicationsListController(ApplicationsService, $state, $filter, $scope, $compile) {
    var vm = this;

    vm.openApplication = function(index) {
      vm.currentIndex = index;
      var current = vm.applications[index];
      $state.go('applications.view', { applicationId: current._id });
    };

    ApplicationsService.query(function(data){
      vm.applications = data;
      angular.forEach(vm.applications, function(application, key) {
        application.nr = 1 + key;
        application.date = $filter('date')(application.created, 'yyyy-MM-dd');
      });

      // Datatable code
      // Setup - add a text input to each footer cell
      $('#applicationsList thead tr:first th:not(:first)').each(function (index) {
        var title = $(this).text();
        var pos = index + 1;
        $(this).html('<input class="form-control" id="col-search-'+pos+'" type="text" placeholder="Search '+title+'" />');
      });

      vm.createDatatable(vm.applications);
    });

    vm.createDatatable = function(data){
      vm.table = $('#applicationsList').DataTable({
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
          { data: 'nr' },
          { data: 'date' },
          { data: 'name',
            'fnCreatedCell': function (nTd, sData, oData, iRow, iCol) {
              $(nTd).html('<button class="btn-link" data-ng-click="vm.openApplication('+ iRow+')">'+sData+'</button>');
              // VIKTIG: för att ng-click ska kompileras och finnas.
              $compile(nTd)($scope);
            }
          },
          { data: 'program' },
          { data: 'year' },
          { data: 'email' },
          { data: 'phone' },
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


