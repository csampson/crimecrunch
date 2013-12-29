var Incident = require('../models/incident.js');

exports.index = function(req, res) {
  res.render('index');
};

exports.incidents = function(req, res) {
  Incident.find({
    'coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [ parseFloat(req.query.longitude), parseFloat(req.query.latitude) ] // longitude, latitude
        }
      }, $maxDistance: 500
    }},
    function(error, incidents) {
      if(!incidents)
        return;

      var counts = {};

      // because I don't feel like getting aggregate + $geoNear to work right now
      incidents.forEach(function(incident) {
        if(incident.category in counts)
          counts[incident.category]++;
        else
          counts[incident.category] = 1;
      });

      res.send(counts);
    }
  );
};
