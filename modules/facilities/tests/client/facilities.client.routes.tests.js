(function () {
  'use strict';

  describe('Facilities Route Tests', function () {
    // Initialize global variables
    var $scope,
      FacilitiesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FacilitiesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FacilitiesService = _FacilitiesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('facilities');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/facilities');
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
          FacilitiesController,
          mockFacility;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('facilities.view');
          $templateCache.put('modules/facilities/client/views/view-facility.client.view.html', '');

          // create mock Facility
          mockFacility = new FacilitiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Facility Name'
          });

          //Initialize Controller
          FacilitiesController = $controller('FacilitiesController as vm', {
            $scope: $scope,
            facilityResolve: mockFacility
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:facilityId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.facilityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            facilityId: 1
          })).toEqual('/facilities/1');
        }));

        it('should attach an Facility to the controller scope', function () {
          expect($scope.vm.facility._id).toBe(mockFacility._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/facilities/client/views/view-facility.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FacilitiesController,
          mockFacility;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('facilities.create');
          $templateCache.put('modules/facilities/client/views/form-facility.client.view.html', '');

          // create mock Facility
          mockFacility = new FacilitiesService();

          //Initialize Controller
          FacilitiesController = $controller('FacilitiesController as vm', {
            $scope: $scope,
            facilityResolve: mockFacility
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.facilityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/facilities/create');
        }));

        it('should attach an Facility to the controller scope', function () {
          expect($scope.vm.facility._id).toBe(mockFacility._id);
          expect($scope.vm.facility._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/facilities/client/views/form-facility.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FacilitiesController,
          mockFacility;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('facilities.edit');
          $templateCache.put('modules/facilities/client/views/form-facility.client.view.html', '');

          // create mock Facility
          mockFacility = new FacilitiesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Facility Name'
          });

          //Initialize Controller
          FacilitiesController = $controller('FacilitiesController as vm', {
            $scope: $scope,
            facilityResolve: mockFacility
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:facilityId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.facilityResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            facilityId: 1
          })).toEqual('/facilities/1/edit');
        }));

        it('should attach an Facility to the controller scope', function () {
          expect($scope.vm.facility._id).toBe(mockFacility._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/facilities/client/views/form-facility.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
