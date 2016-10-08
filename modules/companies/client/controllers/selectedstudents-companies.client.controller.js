/*global $:false */
(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompaniesSelectedStudentsController', CompaniesSelectedStudentsController);

  CompaniesSelectedStudentsController.$inject = ['CompaniesService', '$scope','ApplicationsService'];

  function CompaniesSelectedStudentsController(CompaniesService, $scope, ApplicationsService) {
    var vm = this;

    vm.companies = CompaniesService.query(function(data) {
      function isActive(c) {
        return c.active;
      }
      vm.companies = data.filter(isActive);
    });

    vm.applications = ApplicationsService.query(function(data) {
      vm.applications = data;
    });
    $scope.viewCompany = function(index) {
      $scope.company = vm.companies[index]; // Company is the selected one.
      updateList();
    };
    function updateList(){
      vm.currentApplicants = [];
      vm.currentApplicantsSet = new Set();
      vm.currentSelectedStudents = [];
      getApplicantsToCompany($scope.company.name);
    }

    function getApplicantsToCompany(companyName){
      function appendToCurrentApplications(a){
        var hasChosenCompany = false;
        function checkCompany(c){
          if(c.name === companyName){
            hasChosenCompany = true;
          }
        }
        a.companies.forEach(checkCompany);
        if(hasChosenCompany){
          vm.currentApplicantsSet.add(a);
        }
      }
      vm.applications.forEach(appendToCurrentApplications);
      function iterateCompanyStudents(a){
        var isSelected = false;
        function selectedByCompany(student) {
          if(student === a._id){
            isSelected = true;
          }
        }
        $scope.company.chosenStudents.forEach(selectedByCompany);
        return isSelected;
      }
      function removeSelectedByCompany(a){
        return !iterateCompanyStudents(a);
      }
      function removeNotSelectedByCompany(a){
        return iterateCompanyStudents(a);
      }
      vm.currentApplicants = Array.from(vm.currentApplicantsSet);
      vm.currentSelectedStudents = vm.currentApplicants.filter(removeNotSelectedByCompany);
      vm.currentApplicants = vm.currentApplicants.filter(removeSelectedByCompany);
    }
    $scope.selectStudent = function (index){
      var student = vm.currentApplicants[index];
      $scope.company.chosenStudents.push(student._id);
      updateList();
      // TODO: Save to modell
      saveCompany($scope.company);
    };
    $scope.unselectStudent = function (index){
      var student = vm.currentApplicants[index];
      var pos = $scope.company.chosenStudents.indexOf(student._id);
      $scope.company.chosenStudents.splice(pos, 1);
      
      updateList();
      // TODO: Save to modell
      saveCompany($scope.company);
    };

    function saveCompany(company){
      CompaniesService.update(company, function (response) {
        alert('Save successfull');
      }, function (response) {
        alert('Save NOT successfull.');
        console.log(response);
      });
    }



  }
})();
