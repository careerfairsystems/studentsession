(function () {
  'use strict';

  // Applicationsettings controller
  angular
    .module('applicationsettings')
    .controller('ApplicationsettingsController', ApplicationsettingsController)
    .controller('dateCtrler', ['$scope',
      function ($scope) {
        $scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.opened = true;
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 0
        };

        $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

      }
  ])
  .directive('datepickerLocaldate', ['$parse', function ($parse) {
    var directive = {
      restrict: 'A',
      require: ['ngModel'],
      link: link
    };
    return directive;

    function link(scope, element, attr, ctrls) {
      var ngModelController = ctrls[0];

        // called with a JavaScript Date object when picked from the datepicker
      ngModelController.$parsers.push(function (viewValue) {
        console.log(viewValue);console.log(viewValue);console.log(viewValue);
            // undo the timezone adjustment we did during the formatting
        viewValue.setMinutes(viewValue.getMinutes() - viewValue.getTimezoneOffset());
            // we just want a local date in ISO format
        return viewValue.toISOString().substring(0, 10);
      });
    }
  }]);

  ApplicationsettingsController.$inject = ['$scope', '$state', 'Authentication', 'applicationsettingResolve'];

  function ApplicationsettingsController ($scope, $state, Authentication, applicationsetting) {
    var vm = this;

    vm.authentication = Authentication;
    vm.applicationsetting = applicationsetting;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Applicationsetting
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.applicationsetting.$remove($state.go('applicationsettings.list'));
      }
    }

    // Save Applicationsetting
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.applicationsettingForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.applicationsetting._id) {
        vm.applicationsetting.$update(successCallback, errorCallback);
      } else {
        vm.applicationsetting.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('applicationsettings.view', {
          applicationsettingId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
