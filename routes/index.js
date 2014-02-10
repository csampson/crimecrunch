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
        // TODO: handle fetch errors
        if(error)
          return;

        // TODO: handle zero neighborhoods found
        if(!neighborhoods)
          return;

        neighborhood = { name: neighborhoods[0].name, geometry: neighborhoods[0].geometry };
        callback();
      });
    },
    // find incidents within user's neighborhood
    function(callback) {
      Incident.findWithinPolygon(neighborhood.geometry, function(error, incidents) {
        // TODO: handle fetch errors
        if(error)
          return;

        // TODO: handle zero incidents found
        if(!incidents)
          return;

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
