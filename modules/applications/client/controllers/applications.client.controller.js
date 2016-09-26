(function () {
  'use strict';

  // Applications controller
  angular
  .module('applications')
  .controller('ApplicationsController', ApplicationsController);

  ApplicationsController.$inject = ['$scope', '$state', '$timeout', '$window', 'Authentication', 'FileUploader',
  'applicationResolve', 'CompaniesService'];


  function ApplicationsController ($scope, $state, $timeout, $window, Authentication, FileUploader, 
    application, CompaniesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.application = application;
    vm.application.resume = {};
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

    //programs
    var allPrograms = ['Byggteknik med arkitektur / Civil Engineering - Architecture',
                  'Arkitekt / Architect',
                  'Arkitekt / Architect',
                  'Medicin och teknik / Biomedical Engineering',
                  'Bioteknik / Biotechnology',
                  'Bioteknik / Biotechnology',                  
                  'Kemiteknik / Chemical Engineering',
                  'Kemiteknik / Chemical Engineering',
                  'Brandingenjörsutbildning / Fire Protection Engineering',
                  'Brandingenjörsutbildning / Fire Protection Engineering',
                  'Byggteknik med arkitektur / Civil Engineering - Architecture',
                  'Byggteknik med järnvägsteknik / Civil Engineering - Railway Construction',
                  'Byggteknik med järnvägsteknik / Civil Engineering - Railway Construction',
                  'Civil Engineering- Road and Traffic Technology / Civil Engineering- Road and Traffic Technology',
                  'Civil Engineering- Road and Traffic Technology / Civil Engineering- Road and Traffic Technology',
                  'Väg- och vattenbyggnad / Civil Engineering',
                  'Väg- och vattenbyggnad / Civil Engineering',
                  'Datateknik / Computer Science and Engineering',
                  'Datateknik / Computer Science and Engineering',
                  'Informations- och kommunikationsteknik / Information and Communication Engineering',
                  'Informations- och kommunikationsteknik / Information and Communication Engineering',
                  'Ekosystemteknik / Environmental Engineering',
                  'Elektroteknik / Electrical Engineering',
                  'Elektroteknik / Electrical Engineering',
                  'Teknisk Matematik / Engineering Mathematics',
                  'Teknisk Nanovetenskap / Engineering Nanoscience',
                  'Teknisk Fysik / Engineering Physics',
                  'Teknisk Matematik / Engineering Mathematics',
                  'Teknisk Fysik / Engineering Physics',
                  'Teknisk Nanovetenskap / Engineering Nanoscience',
                  'Ekosystemteknik / Environmental Engineering',
                  'Industridesign / Industrial Design',
                  'Industriell ekonomi / Industrial Engineering and Management',
                  'Industridesign / Industrial Design',
                  'Industriell ekonomi / Industrial Engineering and Management',
                  'Lantmäteri / Surveying',
                  'Maskinteknik med teknisk design / Mechanical Engineering with Industrial Design',
                  'Maskinteknik med teknisk design / Mechanical Engineering with Industrial Design',
                  'Maskinteknik / Mechanical Engineering',
                  'Maskinteknik / Mechanical Engineering',
                  'Medicin och teknik / Biomedical Engineering',
                  'Lantmäteri / Surveying'];

    var set = new Set(allPrograms);
    $scope.programs = Array.from(set);

    $scope.years = [1, 2, 3, 4, 5];


    /*------------------------------ File Uploaders --------------------------------------------------------*/

    // Creation of the file uploaders
    $scope.swedishFileUploader = new FileUploader({ url: 'api/applications/resume', alias: 'newResume' });
    $scope.englishFileUploader = new FileUploader({ url: 'api/applications/resume', alias: 'newResume' });

    // Methods for an pdf uploader
    var pdfFilter = {
      name: 'pdfFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|pdf|'.indexOf(type) !== -1;
      }        
    };

    // Connecting of file uploaders to their methods (filters etc.)
    $scope.swedishFileUploader.filters.push(pdfFilter);

    // Called after the user selected a file
    $scope.swedishFileUploader.onAfterAddingFile = function(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            //$scope.pdfURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new resume
    $scope.swedishFileUploader.onSuccessItem = function(fileItem, response, status, headers) {
      // URL to resume put into database
      vm.application.resume.swedishLink = response; 
      // Show success message
      $scope.swedishUploadSuccess = true;
      // Clear uploader queue
      $scope.swedishFileUploader.clearQueue(); 
      return;
    };

    // Resets the upload as unsuccessful
    $scope.swedishUploadUnsuccess = function () {
      $scope.swedishUploadSuccess = false;
    };

    
    $scope.englishFileUploader.filters.push(pdfFilter);
    // Called after the user selected a file
    $scope.englishFileUploader.onAfterAddingFile = function(fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {            
          $timeout(function () {
          //$scope.pdfURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };

    // Called after the user has successfully uploaded a new resume
    $scope.englishFileUploader.onSuccessItem = function(fileItem, response, status, headers) {
      // URL to resume put into database
      $scope.vm.application.resume.englishLink = response; 
      // Show success message
      $scope.englishUploadSuccess = true;
      // Clear uploader queue
      $scope.englishFileUploader.clearQueue(); 
      return;
    };

    // Resets the upload as unsuccessful
    $scope.englishUploadUnsuccess = function () {
      $scope.englishUploadSuccess = false;
    };
    
    /*------------------------------ End of File Uploaders --------------------------------------------------------*/

    $scope.removeSwedishResume = function() {
      $scope.vm.application.resume.swedishLink = '';
      $scope.swedishUploadSuccess = false;
    };

    $scope.removeEnglishResume = function() {
      $scope.vm.application.resume.englishLink = '';
      $scope.englishUploadSuccess = false;
    };

    //limit length of 'vm.application.description'
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

    // Resets the upload as unsuccessful
    $scope.unsuccess = function () {
      $scope.success = false;
    };

    // Save Application
    function save(isValid) {
      console.log('save');
      console.log('vm.application.resume.length', vm.application.resume.length);
      console.log('vm.application.resume', vm.application.resume);
      console.log ('vm.application.resume.englishLink', vm.application.resume.englishLink);
      console.log('vm.application.resume.swedishLink', vm.application.resume.swedishLink);

      vm.error = false;
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.applicationForm');
        vm.error = 'Du har inte fyllt i alla fält / You need to fill all fields';
        return false;
      } else if (vm.application.resume === undefined || 
        (vm.application.resume.englishLink === undefined && vm.application.resume.swedishLink === undefined)) {
        vm.error = 'Du måste bifoga minst ett CV / You must attach at least one resume';
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

    function prettify(str) {
      return str.replace(/\s/g, '')
        .replace(/å/g, 'a')
        .replace(/Å/g, 'A')
        .replace(/ä/g, 'a')
        .replace(/Ä/g, 'A')
        .replace(/ö/g, 'o')
        .replace(/Ö/g, 'O');
    }
  }
})();
