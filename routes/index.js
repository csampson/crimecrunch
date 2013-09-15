var Incident = require('./models/incident.js');

exports.index = function(req, res){
  res.render('index', { title: 'NOLA Crime Stats' });
};
