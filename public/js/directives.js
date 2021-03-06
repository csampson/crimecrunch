'use strict';

angular.module('crimeCrunch.directives', [])
  .directive('locationAutocomplete', function() {
    return {
      link: function(scope, element, attrs) {
        var input = element[0];

        scope.gPlace = new google.maps.places.Autocomplete(input);
        scope.gPlace.setComponentRestrictions({country:'us'});

        google.maps.event.addListener(scope.gPlace, 'place_changed', scope.getIncidentsByAddress);
      }
    };
});
