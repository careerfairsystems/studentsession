/*global $:false */
(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompaniesListController', CompaniesListController);

  CompaniesListController.$inject = ['CompaniesService', '$scope','$location', '$anchorScroll', '$compile', '$window', '$timeout', 'FileUploader'];

  function CompaniesListController(CompaniesService, $scope, $location, $anchorScroll, $compile, $window, $timeout, FileUploader) {
    var vm = this;

    vm.companies = CompaniesService.query(function(data) {
      vm.companies = data;
      angular.forEach(vm.companies, function(company, key) {
        company.weOffer = company.weOffer || '';
        company.language = company.language || '';
      });
      // Datatable code
      // Setup - add a text input to each first header row cell
      $('#companiesList thead tr:first th').each(function (index) {
        var title = $(this).text();
        var pos = index ;
        $(this).html('<input class"form-control" id="col-search-'+pos+'" type="text" placeholder="Search '+title+'" />');
      });  
      vm.createDatatable(data);
    });


    $scope.gotoSelected = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('company');

      // call $anchorScroll()
      $anchorScroll();
    };

    $scope.viewCompany = function(company) {
      $scope.company = company; // Company is the selected one.
      $scope.gotoSelected();
    };


    // Create Datatable
    vm.createDatatable = function(data){
      vm.table = $('#companiesList').DataTable({
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
          { data: 'name',
            'fnCreatedCell': function (nTd, sData, oData, iRow, iCol) {
              $(nTd).html('<button class="btn-link" data-ng-click="vm.openCompany('+ iRow+')">'+sData+'</button>');
              $compile(nTd)($scope);
            }
          },
          { data: 'active' },
          { data: 'website' },
          { data: 'branch' },
          { data: 'desiredProgramme' },
          { data: 'weOffer' },
          { data: 'language' }
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



    // Create modal functions.
    vm.current = {};
    vm.currentIndex = -1;
    var modal = document.getElementById('myModal');
    var btn = document.getElementById('myBtn');
    var closeBtn = document.getElementsByClassName('close')[0];
    vm.openCompany = function(index) {
      vm.currentIndex = index;
      $scope.current = vm.companies[index];
      $scope.imageURL = 'api/companies/logo/' + $scope.current.profileImageURL;
      modal.style.display = 'block';
    };
    closeBtn.onclick = function() {
      modal.style.display = 'none';
      vm.currentIndex = -1;
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
    vm.updateCompany = function(){
      // Update DB.
      CompaniesService.update(vm.companies[vm.currentIndex], function (response) {
       //success function
        alert('Save successfull');
      }, function (response) {
        //error function
        alert('Save NOT successfull.');
      });

      // Recreate datatable
      vm.table.destroy();
      vm.createDatatable(vm.companies);
      // Hide modal
      modal.style.display = 'none';
    };


    // Uploader Code
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/companies/logo',
      alias: 'newCompanyLogo'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

   // Called after the user selected a new logo
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      $scope.success = true;
      $scope.current.profileImageURL = response;
      $scope.cancelUpload();
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      $scope.cancelUpload();
      $scope.error = response.message;
    };

    // Change company logo
    $scope.uploadProfilePicture = function () {
      $scope.success = $scope.error = null;
      $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = '/api/companies/logo/' + $scope.current.profileImageURL;
    };








  }
})();
