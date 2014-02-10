'use strict';

angular.module('crimeCrunch.controllers', [])
  .controller('IncidentsListController', ['$scope', '$http', 'geolocation',
    function($scope, $http, geolocation) {
      $scope.getIncidents = function() {
        $http.get('/incidents', { params: $scope.coordinates }).success(function(response) {
          $scope.neighborhood = response.neighborhood;
          $scope.incidents = _.map(response.incidents, function(count, crime) { return { label: crime, count: count }; });
        });
      };

      $scope.getIncidentsByAddress = function() {
        var placeLocation = $scope.gPlace.getPlace().geometry.location;

        $scope.coordinates = {
          longitude: placeLocation.lng(),
          latitude:  placeLocation.lat()
        };

        $scope.getIncidents();
      };

      $scope.getIncidentsByLocation = function() {
        geolocation.getPosition().then(function(data) {
          $scope.coordinates = data;
          $scope.address = 'My location';
          $scope.getIncidents();
        });
      };
    }
  ]);
