/*global $:false */
(function () {
  'use strict';

  angular
    .module('companies')
    .controller('CompaniesSchedulingController', CompaniesSchedulingController);

  CompaniesSchedulingController.$inject = ['CompaniesService', '$scope', 'ApplicationsService'];

  function CompaniesSchedulingController(CompaniesService, $scope, ApplicationsService) {
    var vm = this;

    $scope.chosenStudents = [];

    vm.companies = CompaniesService.query(function(data) {
      function sortName(c1, c2){ return c1.name > c2.name ? 1 : -1; }
      vm.companies = data.sort(sortName);
      angular.forEach(vm.companies, function(company, key) {
        company.weOffer = company.weOffer || '';
        company.language = company.language || '';
      });
    });
    vm.applications = ApplicationsService.query(function(data){
      vm.applications = data;
    });
    function prettify(str){
      return str.replace(/[ÅÄÖåäöøé\/ÉüÜ ]/g, '');
    }

    function getChosenStudents(company){
      $scope.chosenStudents = vm.applications.filter(areChosen);
      function areChosen(a){
        return company.chosenStudents.filter(function (c){ return c === a._id; }).length > 0;
      }
    }
    function getAppliedStudents(company){
      $scope.appliedStudents = vm.applications.filter(hasSelectedCompany).filter(areNotChosen);
      function hasSelectedCompany(a){
        return a.companies.filter(function(c){ 
          return prettify(c.name) === prettify(company.name); 
        }).length > 0;
      }
      function areNotChosen(a){
        return company.chosenStudents.filter(function (c){ return c === a._id; }).length === 0;
      }
    }
    $scope.addStudent = function(){
      if(!vm.studentToAdd){
        return;
      }
      $scope.company.chosenStudents.push(vm.studentToAdd._id);
      $scope.chosenStudents.push(vm.studentToAdd);
      $scope.appliedStudents = $scope.appliedStudents.filter(notAddedStudent);
      function notAddedStudent(s){ return s._id !== vm.studentToAdd._id; }
      vm.studentToAdd = undefined;
    };

    $scope.viewCompany = function(company) {
      $scope.company = company; // Company is the selected one.
      getChosenStudents(company);
      getAppliedStudents(company);
      $scope.message = undefined;
    };
    $scope.hideCompany = function() {
      $scope.company = undefined; // Company is the selected one.
    };

    vm.updateCompany = function(){
      // Update DB.
      function saveCompany(company){
        var comp = CompaniesService.get({ companyId: company._id }, function() {
          comp = company;
          comp.$save();
          $scope.message = 'Saved company';
        });
      }
      saveCompany($scope.company);
    };
  }
})();
