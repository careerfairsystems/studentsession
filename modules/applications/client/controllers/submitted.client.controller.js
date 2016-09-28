(function () {
  'use strict';

  // Submitted controller
  angular
    .module('applications')
    .controller('SubmittedController', SubmittedController);

  SubmittedController.$inject = ['$stateParams', '$http', '$scope'];

  function SubmittedController ($stateParams, $http, $scope) {
    var vm = this;

    vm.name = $stateParams.name;
    vm.email = $stateParams.email;
    /*
    $http.post('/api/applications/confirmationmail', { name: vm.name, email: vm.email }).success(function (response) {
      // Show user success message 
      $scope.success = response.message;
    }).error(function (response) {
      // Show user error message 
      $scope.error = response.message;
    });
    */

  }
})();
