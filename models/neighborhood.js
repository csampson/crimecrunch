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

NeighborhoodSchema.statics.findByPoint = function (points, callback) {
  this.where('geometry').intersects({
    type: 'Point',
    coordinates: [points[0], points[1]]
  }).exec(callback);
}

var Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);

module.exports = Neighborhood;
