'use strict';

angular.module('crimeCrunch.controllers', [])
  .controller('IncidentsListController', ['$scope', '$http', 'geolocation',
    function($scope, $http, geolocation) {
      $scope.getIncidents = function() {
        $http.get('/incidents', { params: $scope.coordinates }).success(function(response) {
          $scope.incidents = _.map(response, function(count, crime) { return { label: crime, count: count }; });
        });
      };

      $scope.getIncidentsByAddress = function() {
        var placeLocation = $scope.gPlace.getPlace().geometry.location;

        $scope.coordinates = {
          longitude: placeLocation.ob,
          latitude:  placeLocation.nb
        };

        $scope.getIncidents();
      };

      $scope.getIncidentsByLocation = function() {
        geolocation.getPosition().then(function(data) {
          $scope.coordinates = data;
          $scope.getIncidents();
        });
      };
    }
  ]);
