'use strict';

describe('crimeCrunch controllers', function() {
  beforeEach(module('crimeCrunch'));

  describe('IncidentsListController', function() {
    var IncidentsListController, injector, scope, $rootScope, $controller, $q, $httpBackend, geolocation;

    beforeEach(inject(function($injector) {
      injector     = $injector;
      scope        = injector.get('$rootScope');
      $controller  = injector.get('$controller');
      $q           = injector.get('$q');
      $httpBackend = injector.get('$httpBackend');
      geolocation  = injector.get('geolocation');

      IncidentsListController = $controller('IncidentsListController', { $scope : scope });
    }));

    it('should be able to fetch incidents', function() {
      $httpBackend.whenGET(/^\/incidents*/).respond({ incidents: { Assault: 22 } });

      scope.getIncidents();
      $httpBackend.flush();
      expect(scope.incidents[0]).toEqual({ label: 'Assault', count: 22 });
    });

    it('should be able to fetch neighborhood data', function() {
      $httpBackend.whenGET(/^\/incidents*/).respond({ neighborhood: { name: 'Lower Garden District'} });

      scope.getIncidents();
      $httpBackend.flush();
      expect(scope.neighborhood.name).toEqual('Lower Garden District');
    });
  });
});
