var async = require('async'),
    mongoose = require('mongoose'),
    Neighborhood = require('../models/neighborhood.js'),
    neighborhoodData = require('../data/new_orleans.json').features; // neighborhood data stored as GeoJSON FeatureCollection

mongoose.connect('mongodb://localhost/crime_crunch');

function saveNeighborhood(neighborhoodData, callback) {
  var name = neighborhoodData.properties.name,
      geometry = neighborhoodData.geometry;

  var neighborhood = new Neighborhood({
    name: name,
    geometry: {
      type: 'Polygon',
      coordinates: geometry.coordinates[0] // JSON stores boundaries as MultiPolygon -- this fudges that into a Polygon
    }
  });

  neighborhood.save(function(error) {
    if(error) console.error(error);

    console.log('Inserting record for ' + name);
    callback();
  });
}

async.forEach(neighborhoodData, saveNeighborhood, function() {
  console.log('Finished inserting neighborhoods.')
  process.exit();
});
