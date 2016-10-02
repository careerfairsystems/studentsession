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
      .state('applications.submitted', {
        url: '/submitted/:name/:email',
        templateUrl: 'modules/applications/client/views/submitted-application.client.view.html',
        controller: 'SubmittedController',
        controllerAs: 'vm',
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
          roles: [/*'user', */'admin'],
          pageTitle: 'Edit Application {{ applicationResolve.name }}'
        }
      })
//      .state('applications.info', {
//        url: '/info',
//        templateUrl: 'modules/applications/client/views/info-application.client.view.html',
//
//      })
      .state('applications.view', {
        url: '/:applicationId',
        templateUrl: 'modules/applications/client/views/view-application.client.view.html',
        controller: 'ViewApplicationController',
        controllerAs: 'vm',
        resolve: {
          applicationResolve: getApplication
        },
        data:{
          pageTitle: 'Application {{ articleResolve.name }}'
        }
      })
      .state('applications.attachments', { //behövs ens denna?
        url: '/attachments/:applicationId/',
        templateUrl: 'modules/applications/client/views/form-attachments.client.view.html', //kolla närmare på denna
        controller: 'ApplicationsController', //gemensam controller pga i samma view
        controllerAs: 'vm',
        resolve: {
          applicationResolve: getApplication,
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Bilagor' //??
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
