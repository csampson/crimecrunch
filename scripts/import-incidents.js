var async = require('async'),
    http = require('http'),
    querystring = require('querystring'),
    mongoose = require('mongoose'),
    moment = require('moment'),
    proj4 = require('proj4js'),
    Incident = require('../models/incident.js');

require('twix');

mongoose.connect('mongodb://localhost/crime_crunch');

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

function fetchIncidents(day, params, callback) {
  params.db = day+'+00:00:00';
  params.de = day+'+23:59:00';

  http.get('http://www.crimemapping.com/GetIncidents.aspx?' + querystring.unescape(querystring.stringify(params)), function(response) {
    var body = '';

    response.on('data', function(chunk) {
      body += chunk;
    });

    response.on('end', function() {
      var parsedBody = JSON.parse(body);

      if('errorMessage' in parsedBody) {
        console.log('Came back with an error: ' + parsedBody.errorMessage);
        callback();
      }
      else if(!parsedBody.incidents.length) {
        console.log('No incidents for ' + day);
        callback();
      }
      else {
        var parsedIncidents = parsedBody.incidents;

        async.forEach(parsedIncidents, saveIncident, function() {
          console.log('Finished inserting new incidents for ' + day);
          callback();
        });
      }
    });
  });
}

Incident.remove(function() {
  console.log('Cleared incidents collection');
  console.log('Fetching incident data from crimemapping.com');

  var now = moment(),
      sixMonthsAgo = moment().subtract('month', 6), // expect crime data to only be available roughly 6 months back
      dayIterator = sixMonthsAgo.twix(now).iterate('days');

  var params = {
    ccs: 'AR,AS,BU,DP,DR,DU,FR,HO,VT,RO,SX,TH,VA,VB,WE', // all crime type codes
    xmin: -10058512.647324989, // These are points for a rough square-plot of New Orleans
    xmax: -9997363.02469693,
    ymin: 3487932.83757992,
    ymax: 3506468.8169390503
  };

  async.whilst(
    function() {
      return dayIterator.hasNext();
    },
    function(callback) {
      var day = dayIterator.next().format('MM/DD/YYYY');

      console.log('Fetching incidents for ' + day);

      fetchIncidents(day, params, callback);
    },
    function() {
      console.log('\nDone');
      process.exit();
    }
  );
});
