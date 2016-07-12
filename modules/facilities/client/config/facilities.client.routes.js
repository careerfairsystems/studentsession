(function () {
  'use strict';

  angular
    .module('facilities')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('facilities', {
        abstract: true,
        url: '/facilities',
        template: '<ui-view/>'
      })
      .state('facilities.list', {
        url: '',
        templateUrl: 'modules/facilities/client/views/list-facilities.client.view.html',
        controller: 'FacilitiesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Facilities List'
        }
      })
      .state('facilities.create', {
        url: '/create',
        templateUrl: 'modules/facilities/client/views/form-facility.client.view.html',
        controller: 'FacilitiesController',
        controllerAs: 'vm',
        resolve: {
          facilityResolve: newFacility
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Facilities Create'
        }
      })
      .state('facilities.edit', {
        url: '/:facilityId/edit',
        templateUrl: 'modules/facilities/client/views/form-facility.client.view.html',
        controller: 'FacilitiesController',
        controllerAs: 'vm',
        resolve: {
          facilityResolve: getFacility
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Facility {{ facilityResolve.name }}'
        }
      })
      .state('facilities.view', {
        url: '/:facilityId',
        templateUrl: 'modules/facilities/client/views/view-facility.client.view.html',
        controller: 'FacilitiesController',
        controllerAs: 'vm',
        resolve: {
          facilityResolve: getFacility
        },
        data:{
          pageTitle: 'Facility {{ articleResolve.name }}'
        }
      });
  }

  getFacility.$inject = ['$stateParams', 'FacilitiesService'];

  function getFacility($stateParams, FacilitiesService) {
    return FacilitiesService.get({
      facilityId: $stateParams.facilityId
    }).$promise;
  }

  newFacility.$inject = ['FacilitiesService'];

  function newFacility(FacilitiesService) {
    return new FacilitiesService();
  }
})();
