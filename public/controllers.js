'use strict';

angular.module('crimeCrunch.controllers', [])
	.controller('IncidentsListController', ['$scope', '$http', 'geolocation',
		function($scope, $http, geolocation) {
			$scope.getIncidents = function() {
				geolocation.getPosition().then(function(data) {
					$http.get('/incidents', { params: data }).success(function(response) {
						$scope.incidents = _.map(response, function(count, crime) { return { label: crime, count: count }; });
					});
				});
			};
		}
	]);
