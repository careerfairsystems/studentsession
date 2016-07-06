(function () {
  'use strict';

  // Applications controller
  angular
    .module('applications')
    .controller('ApplicationsController', ApplicationsController);

  ApplicationsController.$inject = ['$scope', '$state', 'Authentication', 'applicationResolve', 'CompaniesService'];

  function ApplicationsController ($scope, $state, Authentication, application, CompaniesService) {
    var vm = this;
    
    //fetches the companies from the database (promise??)
    $scope.companies = CompaniesService.query();

    //makes a list with the company names
    //$scope.companies.name;


    vm.authentication = Authentication;
    vm.application = application;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    //generates the data to select
    $scope.data = {
      model: null,
      availableOptions: [
        {
          id: '1', name: 'Option A'
        },
        {
          id: '2', name: 'Option B'
        },
        {
          id: '3', name: 'Option C'
        }
      ],
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

    // Add data to a drop-down menu
  }
})();
