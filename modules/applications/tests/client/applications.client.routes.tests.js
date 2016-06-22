(function () {
  'use strict';

  describe('Applications Route Tests', function () {
    // Initialize global variables
    var $scope,
      ApplicationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ApplicationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ApplicationsService = _ApplicationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('applications');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/applications');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ApplicationsController,
          mockApplication;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('applications.view');
          $templateCache.put('modules/applications/client/views/view-application.client.view.html', '');

          // create mock Application
          mockApplication = new ApplicationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Application Name'
          });

          //Initialize Controller
          ApplicationsController = $controller('ApplicationsController as vm', {
            $scope: $scope,
            applicationResolve: mockApplication
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:applicationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.applicationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            applicationId: 1
          })).toEqual('/applications/1');
        }));

        it('should attach an Application to the controller scope', function () {
          expect($scope.vm.application._id).toBe(mockApplication._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/applications/client/views/view-application.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ApplicationsController,
          mockApplication;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('applications.create');
          $templateCache.put('modules/applications/client/views/form-application.client.view.html', '');

          // create mock Application
          mockApplication = new ApplicationsService();

          //Initialize Controller
          ApplicationsController = $controller('ApplicationsController as vm', {
            $scope: $scope,
            applicationResolve: mockApplication
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.applicationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/applications/create');
        }));

        it('should attach an Application to the controller scope', function () {
          expect($scope.vm.application._id).toBe(mockApplication._id);
          expect($scope.vm.application._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/applications/client/views/form-application.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ApplicationsController,
          mockApplication;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('applications.edit');
          $templateCache.put('modules/applications/client/views/form-application.client.view.html', '');

          // create mock Application
          mockApplication = new ApplicationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Application Name'
          });

          //Initialize Controller
          ApplicationsController = $controller('ApplicationsController as vm', {
            $scope: $scope,
            applicationResolve: mockApplication
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:applicationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.applicationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            applicationId: 1
          })).toEqual('/applications/1/edit');
        }));

        it('should attach an Application to the controller scope', function () {
          expect($scope.vm.application._id).toBe(mockApplication._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/applications/client/views/form-application.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
