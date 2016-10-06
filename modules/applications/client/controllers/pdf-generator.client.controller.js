(function () {
  'use strict';

  // PDF generator controller
  angular
    .module('applications')
    .controller('PDFGeneratorController', PDFGeneratorController);

  PDFGeneratorController.$inject = ['$stateParams', '$http', '$scope', 'ApplicationsService'];

  function PDFGeneratorController ($stateParams, $http, $scope, ApplicationsService) {
    var vm = this;

    vm.applications = ApplicationsService.query();

    
    $scope.getCompletePdf = function(){
      $http.post('/api/applications/generatepdf', { applicationId: vm.applications[0]._id }).success(function (response) {
        // Show user success message 
        $scope.success = response.message;
        $scope.error = response.message;
        console.log(response);
      }).error(function (response) {
        // Show user error message 
        $scope.error = response.message;
      });
    };
  }
})();
