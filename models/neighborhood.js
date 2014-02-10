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

NeighborhoodSchema.statics.findByPoint = function (point, callback) {
  this.where('geometry').intersects().geometry({
    type: 'Point',
    coordinates: [point[0], point[1]]
  }).lean().exec(callback);
}

var Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);

module.exports = Neighborhood;
