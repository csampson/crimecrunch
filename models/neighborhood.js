var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NeighborhoodSchema = new Schema({
  id: Schema.ObjectId,
  name: String,
  geometry: {
    type: { type: String },
    coordinates: {
      type: Array,
      index: '2dsphere'
    }
  }
});

var Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);

module.exports = Neighborhood;
