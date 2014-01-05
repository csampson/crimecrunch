angular.module('crimeCrunch.directives', [])
  .directive('locationAutocomplete', function() {
    return {
      link: function(scope, element, attrs) {
        var input = element[0];

        scope.gPlace = new google.maps.places.Autocomplete(input);

        google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
          scope.getIncidentsByAddress();
        });
      }
    };
});
