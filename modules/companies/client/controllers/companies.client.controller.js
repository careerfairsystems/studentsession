(function () {
  'use strict';

  // Companies controller
  angular
    .module('companies')
    .controller('CompaniesController', CompaniesController);

  CompaniesController.$inject = ['$scope', '$state', '$timeout', '$window', 'Authentication', 'companyResolve', 'FileUploader'];

  function CompaniesController ($scope, $state, $timeout, $window, Authentication, company, FileUploader) {
    var vm = this;

    vm.authentication = Authentication;
    vm.company = company;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //filuppladdning
    $scope.imgUrlBase = 'public/uploads/logos/';
    $scope.pdfURL = $scope.imgUrlBase + vm.company.name + '.jpg';

    // Resets the upload as unsuccessful
    $scope.unsuccess = function () {
      $scope.success = false;
    };

    function prettify(str) {
      return str.replace(/\s/g, '')
        .replace(/å/g, 'a')
        .replace(/Å/g, 'A')
        .replace(/ä/g, 'a')
        .replace(/Ä/g, 'A')
        .replace(/ö/g, 'o')
        .replace(/Ö/g, 'O');
    }

    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/companies/logo/', //osäker på om .pdf behövs
      alias: 'newLogo'
    });

    // Set file uploader pdf filter
    $scope.uploader.filters.push({
      name: 'jpgFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|'.indexOf(type) !== -1;
      }
    });

   // Called after the user selected a file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
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
      // URL to resume put into database
      vm.application.resume = $scope.uploader.url;
      // Show success message
      $scope.success = true;
      // Clear uploader queue
      $scope.uploader.clearQueue(); //?
      return;
    };

    // Remove existing Company
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.company.$remove($state.go('companies.list'));
      }
    }

    // Save Company
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.companyForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.company._id) {
        vm.company.$update(successCallback, errorCallback);
      } else {
        vm.company.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('companies.view', {
          companyId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
