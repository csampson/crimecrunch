var async = require('async'),
    mongoose = require('mongoose'),
    http = require('http'),
    querystring = require('querystring'),
    moment = require('moment'),
    proj4 = require('proj4js'),
    Incident = require('../models/incident.js');

mongoose.connect('mongodb://localhost/nola_crime_stats');

function saveIncident(incident, callback) {
  var originalProjection = '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=21350 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs', // SR-ORG:6 with rough northing offset
      newProjection = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs', // WGS84
      coordinates = proj4(originalProjection, newProjection, [incident.Y, incident.X]);

  var incident = new Incident({
    agencyName: incident.AgencyName,
    caseNumber: incident.CaseNumber,
    category: incident.CrimeCode,
    description: incident.Description,
    date: incident.DateReported,
    location: incident.Location,
    coordinates: [ coordinates[0], coordinates[1] ]
  });

  incident.save(callback);
}

Incident.remove(function() {
  console.log('Cleared incidents collection');
  console.log('Fetching incident data from crimemapping.com');

  var endDate = moment(),
      beginningDate = moment(endDate).subtract('months', 6); // expect crime data to only be for 6 months back

  var params = {
    db: beginningDate.format('MM/DD/YYYY'), // beginning date
    de: endDate.format('MM/DD/YYYY'), // end date
    ccs: 'AR,AS,BU,DP,DR,DU,FR,HO,VT,RO,SX,TH,VA,VB,WE', // all crime types
    xmin: -10058512.647324989, // This and other points use Google maps spatial ref. This is a rough square-plot of the New Orleans area
    xmax: -9997363.02469693,
    ymin: 3487932.83757992,
    ymax: 3506468.8169390503
  };

  http.get('http://www.crimemapping.com/GetIncidents.aspx?' + querystring.stringify(params), function(response) {
    var body = '';

    response.on('data', function(chunk) {
      body += chunk;
    });

    response.on('end', function() {
      var parsedIncidents = JSON.parse(body).incidents;

      async.forEach(parsedIncidents, saveIncident, function() {
        console.log('Finished inserting new incidents');
        process.exit();
      });
    });
  });
});
