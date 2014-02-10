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
  geometry: {
    type: { type: String },
    coordinates: {
      type: Array,
      index: '2dsphere'
    }
  }
});

IncidentSchema.statics.findWithinPolygon = function(geometry, callback) {
  this.where('geometry').within().geometry(geometry).lean().exec(callback);
};

var Incident = mongoose.model('Incident', IncidentSchema);

module.exports = Incident;
