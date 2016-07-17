(function () {
  'use strict';

  // Applications controller
  angular
    .module('applications')
    .controller('ApplicationsController', ApplicationsController);

  ApplicationsController.$inject = ['$scope', '$state', '$timeout', '$window', 'Authentication', 'FileUploader',
  'applicationResolve', 'CompaniesService'];

  function ApplicationsController ($scope, $state, $timeout, $window, FileUploader, application, 
    Authentication, CompaniesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.application = application;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //filuppladdning
    $scope.user = Authentication.user;
    $scope.imgUrlBase = 'public/uploads/';
    $scope.pdfURL = $scope.imgUrlBase + vm.application._id + '.pdf';
    //slut

    //fetches the company names from the database 
    $scope.companyNames = [];
    CompaniesService.query().$promise.then(function(result) {
      angular.forEach(result, function(company) {
        $scope.companyNames.push(company.name);      
      });
    });

    //meeting times
    $scope.times = ['16/11 8-10', 
                    '16/11 10-12',
                    '16/11 13-15', 
                    '16/11 15-17',
                    '17/11 8-10', 
                    '17/11 10-12', 
                    '17/11 13-15', 
                    '17/11 15-17'];

    //limit length of "vm.application.description"
    $scope.monitorLength = function (maxLength) {
      if ($scope.vm.application.description.length > maxLength) {
        $scope.vm.application.description = $scope.vm.application.description.substring(0, maxLength);
      }
    };

    // Remove existing Application
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.application.$remove($state.go('applications.list'));
      }
    }

    // Save Application
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.applicationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.application._id) {
        vm.application.$update(successCallback, errorCallback);
      } else {
        vm.application.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('applications.view', {
          applicationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    // filuppladdning: detta får viewen att gå sönder :((
    // Create file uploader instance
    $scope.uploader = new FileUploader({
        url: 'api/applications/resume/' + vm.application._id, //nej
        alias: 'newResume'
    });
/**
     // Set file uploader pdf filter
     $scope.uploader.filters.push({
      name: 'pdfFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|pdf|'.indexOf(type) !== -1;
      }
     });
 
     // Called after the user selected a file
     $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader() ;
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.pdfURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
     };

     // Called after the user has successfully uploaded a new resume
     $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
       // Show success message
       $scope.success = true;
       // Clear upload buttons
       $scope.cancelUpload();
 
       $state.go('applications.submitted');
       event.preventDefault();
       return;
      }; 
      //slut*/
  }
})();
