var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var IncidentSchema = new Schema({
  id: Schema.ObjectId,
  agencyName: String,
  caseNumber: String,
  category: String,
  description: String,
  date: Date,
  location: String,
  coordinates: Array
});

module.exports = mongoose.model('Incident', IncidentSchema);
