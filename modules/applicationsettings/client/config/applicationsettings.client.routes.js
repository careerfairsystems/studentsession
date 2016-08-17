(function () {
  'use strict';

  angular
    .module('applicationsettings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('applicationsettings', {
        abstract: true,
        url: '/applicationsettings',
        template: '<ui-view/>'
      })
      .state('applicationsettings.list', {
        url: '',
        templateUrl: 'modules/applicationsettings/client/views/list-applicationsettings.client.view.html',
        controller: 'ApplicationsettingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Applicationsettings List'
        }
      })
      .state('applicationsettings.create', {
        url: '/create',
        templateUrl: 'modules/applicationsettings/client/views/form-applicationsetting.client.view.html',
        controller: 'ApplicationsettingsController',
        controllerAs: 'vm',
        resolve: {
          applicationsettingResolve: newApplicationsetting
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Applicationsettings Create'
        }
      })
      .state('applicationsettings.edit', {
        url: '/:applicationsettingId/edit',
        templateUrl: 'modules/applicationsettings/client/views/form-applicationsetting.client.view.html',
        controller: 'ApplicationsettingsController',
        controllerAs: 'vm',
        resolve: {
          applicationsettingResolve: getApplicationsetting
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Applicationsetting {{ applicationsettingResolve.name }}'
        }
      })
      .state('applicationsettings.view', {
        url: '/:applicationsettingId',
        templateUrl: 'modules/applicationsettings/client/views/view-applicationsetting.client.view.html',
        controller: 'ApplicationsettingsController',
        controllerAs: 'vm',
        resolve: {
          applicationsettingResolve: getApplicationsetting
        },
        data:{
          pageTitle: 'Applicationsetting {{ articleResolve.name }}'
        }
      });
  }

  getApplicationsetting.$inject = ['$stateParams', 'ApplicationsettingsService'];

  function getApplicationsetting($stateParams, ApplicationsettingsService) {
    return ApplicationsettingsService.get({
      applicationsettingId: $stateParams.applicationsettingId
    }).$promise;
  }

  newApplicationsetting.$inject = ['ApplicationsettingsService'];

  function newApplicationsetting(ApplicationsettingsService) {
    return new ApplicationsettingsService();
  }
})();
