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
    vm.imageURL = '';

    $scope.file_changed = function(element) {
      var photofile = element.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        $scope.$apply(function() {
          $scope.imageURL = e.target.result;
          vm.company.profileImageURL = $scope.imageURL;
        });
      };
      reader.readAsDataURL(photofile);
    };

   // Create file uploader instance
//    $scope.uploader = new FileUploader({
//      url: 'api/companies/picture',
//      alias: 'newProfilePicture'
//    });

   // Set file uploader image filter
//  $scope.uploader.filters.push({
//      name: 'imageFilter',
//      fn: function (item, options) {
//        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
//        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
//      }
//    });

   // Called after the user selected a new picture file
  //  $scope.uploader.onAfterAddingFile = function (fileItem) {
  //    if ($window.FileReader) {
  //      var fileReader = new FileReader();
  //      fileReader.readAsDataURL(fileItem._file);

  //      fileReader.onload = function (fileReaderEvent) {
  //        $timeout(function () {
  //          $scope.imageURL = fileReaderEvent.target.result;
  //        }, 0);
  //      };
  //    }
  //  };

   // Called after the user has successfully uploaded a new picture
    //$scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
    //  $scope.success = true;

     // Populate user object
    //  $scope.company = response;

     // Clear upload buttons
    //  $scope.cancelUpload();
    //};

   // Called after the user has failed to uploaded a new picture
    //$scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
    //  $scope.cancelUpload();

      // Show error message
    //  $scope.error = response.message;
    //};

   // Change user profile picture
    //$scope.uploadProfilePicture = function () {
      // Clear messages
    //  $scope.success = $scope.error = null;

     // Start upload
      //$scope.uploader.uploadAll();
    //};

   // Cancel the upload process
  // $scope.cancelUpload = function () {
  //    $scope.uploader.clearQueue();
  //    $scope.imageURL = '/api/companies/picture/' + vm.company.profileImageURL;
  //  };
    
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
