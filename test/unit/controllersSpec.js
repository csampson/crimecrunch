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
      $httpBackend.whenGET(/^\/incidents*/).respond({ Assault: 22 });

      // fake geolocation
      spyOn(geolocation, 'getPosition').andCallFake(function() {
        var defered = $q.defer();
        defered.resolve({ latitude: 90, longitude: 90 });
        return defered.promise;
      });

      scope.getIncidents();
      $httpBackend.flush();
      expect(scope.incidents[0]).toEqual({ label: 'Assault', count: 22 });
    });
  });
});
