(function () {
  'use strict';

  // Submitted controller
  angular
    .module('applications')
    .controller('SubmittedController', SubmittedController);

  SubmittedController.$inject = ['$stateParams', '$http', '$scope'];

  function SubmittedController ($stateParams, $http, $scope) {
    var vm = this;

    vm.appid = $stateParams.appid;
    
    $http.post('/api/applications/confirmationmail', { applicationId: vm.appid }).success(function (response) {
      // Show user success message 
      $scope.success = response.message;
      $scope.error = response.message;
    }).error(function (response) {
      // Show user error message 
      $scope.error = response.message;
    });
  }
})();
