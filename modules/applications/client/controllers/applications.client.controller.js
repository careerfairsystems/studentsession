/* global $:false */
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
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.application.year = '';
    vm.application.times = [];
    vm.application.companies = [];
    vm.application.resume = {};
    vm.createMode = !vm.application._id;

    //filuppladdning
    //$scope.user = Authentication.user;
    $scope.imgUrlBase = 'public/uploads/';
    $scope.pdfURL = $scope.imgUrlBase + vm.application._id + '.pdf';
    //slut

    //fetches the company names from the database
    $scope.companyNames = [];
    $scope.chosenCompanies = [];
    CompaniesService.query().$promise.then(function(result) {
      angular.forEach(result, function(company) {
        if(company.active){
          $scope.companyNames.push(company.name);
        }
      });
      $scope.companyNames.sort();
    });

    $scope.selectCompany = function (){
      var selection = $('#selectcompanies').find(":selected").text();
      if (!selection)
        return;
      var index = $('#selectcompanies').val();
      $scope.companyNames.splice(index, 1);
      $scope.chosenCompanies.push({ name: selection, motivation: '', edit: true });
    };
    $scope.deleteCompany = function (index){
      $scope.companyNames.push($scope.chosenCompanies[index].name);
      $scope.companyNames.sort();
      $scope.chosenCompanies.splice(index, 1);
    };

    $scope.choiceOn = false;
    $('#selectcompanies').on('change', function() {
      $scope.choiceOn = true;
    });


    //meeting times
    $scope.wed = [
      { time: 10, available: false },
      { time: 11, available: false },
      { time: 12, available: false },
      { time: 13, available: false },
      { time: 14, available: false },
      { time: 15, available: false },
    ];
    $scope.thur = [
      { time: 9, available: false },
      { time: 10, available: false },
      { time: 11, available: false },
      { time: 12, available: false },
      { time: 13, available: false },
      { time: 14, available: false },
    ];
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

        $scope.sweFileName = fileItem.file.name;

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

        $scope.engFileName = fileItem.file.name;

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

    //limit length of descriptions
    $scope.monitorLength = function (maxLength, index) {
      if (vm.application.descriptions[index].description > maxLength) {
        vm.application.descriptions[index].description = vm.application.descriptions[index].description.substring(0, maxLength);
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
      vm.error = false;

      console.log("email", vm.application.email);

      if (vm.form.applicationForm.email.$error.email === true && vm.form.applicationForm.email.$viewValue !== undefined) {
        vm.error = 'Du har angett email på fel format / Email is not on the correct form';
        return false;
      } else if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.applicationForm');
        vm.error = 'Du har inte fyllt i alla fält / You need to fill all fields';
        return false;
      } else if (vm.application.resume === undefined ||
        (vm.application.resume.englishLink === undefined && vm.application.resume.swedishLink === undefined) ||
        (vm.application.resume.englishLink === '' && vm.application.resume.swedishLink === undefined) ||
        (vm.application.resume.englishLink === undefined && vm.application.resume.swedishLink === '') ||
        (vm.application.resume.englishLink === '' && vm.application.resume.swedishLink === '')) {
        vm.error = 'Du måste bifoga minst ett cv / You must attach at least one resume';
        return false;
      } else if (vm.application.companies === undefined || vm.application.companies.length === 0) {
        vm.error = 'Du måste välja minst ett företag / You must choose at least one company';
        return false;
      } else if ($scope.wed === undefined || $scope.wed.length === 0 || $scope.thur === undefined || $scope.thur.length === 0) {
        vm.error = 'Du måste välja minst en tid / You must tell when you are available';
        return false;
      }

      //check that descriptions have been given for all chosen companies
      for(var i = 0; i < $scope.chosenCompanies.length; i++) {
        if($scope.chosenCompanies[i].motivation === '') {
          vm.error = 'Du måste skriva en motivering för varje företag du valt. / You must write a motivation for each company you have chosen.';
          return false;
        }
      }

      vm.application.companies = $scope.chosenCompanies;

      function isAvailable (t){
        return t.available;
      }
      var availableWed = $scope.wed.filter(isAvailable);
      var availableThur = $scope.thur.filter(isAvailable);
      function toTime (t){
        return t.time;
      }
      var wedTime = availableWed.map(toTime);
      var thurTime = availableThur.map(toTime);
      vm.application.times = [ { day: "wed", hour: wedTime }, { day: "thur", hour: thurTime } ];

      // TODO: move create/update logic to service
      if (vm.application._id) {
        vm.application.$update(successCallback, errorCallback);
      } else {
        vm.application.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        if(vm.createMode){
          $state.go('applications.submitted', { name: vm.application.name, email: vm.application.email });
        } else {
          $state.go('applications.view', { applicationId: res._id });
        }
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
