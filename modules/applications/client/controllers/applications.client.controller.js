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

    /*
      Ladda upp flera cv:n;

      arr=[{}];

      Just nu laddas en fil upp. Vill ladda upp valfri mängd när ansökaren klickar på knappen.
      <div ng-repeat = "ngt i arr track by $index"> 
        Ladda upp CV-------
        id: $namn_{{index}} (som man får av ng-repeat) 
      </div>
      
      Button pekar på detta
      func addAttachment = {
                        arr.push({})
                        }

      När man klickar på knapp, kör addAttachment

      Exempel: Lägger till tasks till taskgroups i hostapplication

        attachments: [{
    language: String,
    link: String
  }],
      */

    if(!vm.application.attachments){
      vm.application.attachments = [];
    }

    $scope.languages = ['Svenska / Swedish', 'Engelska / English'];

    //Functions for uploading several resumes/attachments
    $scope.addAttachment = function (attachments) {
      vm.application.attachments.push({ language: '', description: 'resume', edit: true }); //vad betyder edit: true?? finns inte i modellen för tasks
    };

    //Create the first attachment (one required)
    $scope.addAttachment(vm.application.attachments);

    $scope.saveAttachment = function (index) {
      vm.application.attachments[index].edit = false;
    };
    
    $scope.deleteAttachment = function (index) {
      vm.application.attachments.splice(index, 1);
    };
    
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

    // Resets the upload as unsuccessful
    $scope.unsuccess = function () {
      $scope.success = false;
    };

    // Save Application
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.applicationForm');
        vm.error = "Du har inte fyllt i alla fält / You need to fill all fields";
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

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/applications/resume/' + prettify($scope.user.displayName) + $scope.user._id + '_cv' + '.pdf', //osäker på om .pdf behövs
      alias: 'newResume'
    });

    function prettify(str) {
      return str.replace(/\s/g, '')
        .replace(/å/g, 'a')
        .replace(/Å/g, 'A')
        .replace(/ä/g, 'a')
        .replace(/Ä/g, 'A')
        .replace(/ö/g, 'o')
        .replace(/Ö/g, 'O');
    }

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
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // URL to resume put into database
      vm.application.attachments = response; //pusha på response??
      // Show success message
      $scope.success = true;
      // Clear uploader queue
      $scope.uploader.clearQueue(); //?
      return;
    };
      //slut
  }
})();
