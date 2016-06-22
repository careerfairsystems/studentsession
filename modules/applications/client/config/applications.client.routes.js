(function () {
  'use strict';

  angular
    .module('applications')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('applications', {
        abstract: true,
        url: '/applications',
        template: '<ui-view/>'
      })
      .state('applications.list', {
        url: '',
        templateUrl: 'modules/applications/client/views/list-applications.client.view.html',
        controller: 'ApplicationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Applications List'
        }
      })
      .state('applications.create', {
        url: '/create',
        templateUrl: 'modules/applications/client/views/form-application.client.view.html',
        controller: 'ApplicationsController',
        controllerAs: 'vm',
        resolve: {
          applicationResolve: newApplication
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Applications Create'
        }
      })
      .state('applications.edit', {
        url: '/:applicationId/edit',
        templateUrl: 'modules/applications/client/views/form-application.client.view.html',
        controller: 'ApplicationsController',
        controllerAs: 'vm',
        resolve: {
          applicationResolve: getApplication
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Application {{ applicationResolve.name }}'
        }
      })
      .state('applications.view', {
        url: '/:applicationId',
        templateUrl: 'modules/applications/client/views/view-application.client.view.html',
        controller: 'ApplicationsController',
        controllerAs: 'vm',
        resolve: {
          applicationResolve: getApplication
        },
        data:{
          pageTitle: 'Application {{ articleResolve.name }}'
        }
      });
  }

  getApplication.$inject = ['$stateParams', 'ApplicationsService'];

  function getApplication($stateParams, ApplicationsService) {
    return ApplicationsService.get({
      applicationId: $stateParams.applicationId
    }).$promise;
  }

  newApplication.$inject = ['ApplicationsService'];

  function newApplication(ApplicationsService) {
    return new ApplicationsService();
  }
})();
