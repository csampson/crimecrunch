var async        = require('async'),
    Neighborhood = require('../models/neighborhood.js'),
    Incident     = require('../models/incident.js');

exports.index = function(req, res) {
  res.render('index');
};

exports.incidents = function(req, res) {
  var longitude = parseFloat(req.query.longitude),
      latitude  = parseFloat(req.query.latitude),
      neighborhood,
      incidentsByCategory = {};

  async.series([
    // find user's neighborhood
    function(callback) {
      Neighborhood.findByPoint([ longitude, latitude ], function(error, neighborhoods) {
        // TODO: handle zero neighborhoods found
        neighborhood = { name: neighborhoods[0].name, boundaries: neighborhoods[0].geometry.coordinates[0] };
        callback();
      });
    },
    // find incidents within user's neighborhood
    function(callback) {
      Incident.findByPolygon(neighborhood.boundaries, function(error, incidents) {
        if(!incidents)
          return; // TODO: handle zero incidents found

        // because I don't feel like getting aggregate + $geoNear to work right now
        incidents.forEach(function(incident) {
          if(incident.category in incidentsByCategory)
            incidentsByCategory[incident.category]++;
          else
            incidentsByCategory[incident.category] = 1;
        });

        callback();
      });
    }
  ], function() {
    res.send({
      neighborhood: neighborhood,
      incidents: incidentsByCategory
    });
  });
};
