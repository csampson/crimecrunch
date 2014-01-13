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
  coordinates: { type: Array, index: '2dsphere' }
});

IncidentSchema.statics.findByPolygon = function(boundaries, callback) {
  Incident.where('coordinates').within({ polygon: boundaries }).exec(callback);
};

var Incident = mongoose.model('Incident', IncidentSchema);

module.exports = Incident;
