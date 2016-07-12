(function () {
  'use strict';

  angular
    .module('meetings')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('meetings', {
        abstract: true,
        url: '/meetings',
        template: '<ui-view/>'
      })
      .state('meetings.list', {
        url: '',
        templateUrl: 'modules/meetings/client/views/list-meetings.client.view.html',
        controller: 'MeetingsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Meetings List'
        }
      })
      .state('meetings.create', {
        url: '/create',
        templateUrl: 'modules/meetings/client/views/form-meeting.client.view.html',
        controller: 'MeetingsController',
        controllerAs: 'vm',
        resolve: {
          meetingResolve: newMeeting,
          listFacilitiesResolve: getFacilities,
          listApplicationsResolve: getApplications,
          listCompaniesResolve: getCompanies
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Meetings Create'
        }
      })
      .state('meetings.edit', {
        url: '/:meetingId/edit',
        templateUrl: 'modules/meetings/client/views/form-meeting.client.view.html',
        controller: 'MeetingsController',
        controllerAs: 'vm',
        resolve: {
          meetingResolve: getMeeting,
          listFacilitiesResolve: getFacilities,
          listApplicationsResolve: getApplications,
          listCompaniesResolve: getCompanies
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Meeting {{ meetingResolve.name }}'
        }
      })
      .state('meetings.view', {
        url: '/:meetingId',
        templateUrl: 'modules/meetings/client/views/view-meeting.client.view.html',
        controller: 'MeetingsController',
        controllerAs: 'vm',
        resolve: {
          meetingResolve: getMeeting,
        },
        data:{
          pageTitle: 'Meeting {{ articleResolve.name }}'
        }
      });
  }

  getCompanies.$inject = ['$stateParams', 'CompaniesService'];

  function getCompanies($stateParams, CompaniesService) {
    return CompaniesService.query().$promise;
  }

  getApplications.$inject = ['$stateParams', 'ApplicationsService'];

  function getApplications($stateParams, ApplicationsService) {
    return ApplicationsService.query().$promise;
  }

  getFacilities.$inject = ['$stateParams', 'FacilitiesService'];

  function getFacilities($stateParams, FacilitiesService) {
    return FacilitiesService.query().$promise;
  }

  getMeeting.$inject = ['$stateParams', 'MeetingsService'];

  function getMeeting($stateParams, MeetingsService) {
    return MeetingsService.get({
      meetingId: $stateParams.meetingId
    }).$promise;
  }

  newMeeting.$inject = ['MeetingsService'];

  function newMeeting(MeetingsService) {
    return new MeetingsService();
  }
})();
