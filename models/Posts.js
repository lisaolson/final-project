
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: String,
  username: String,
  body: String,
  reports: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

PostSchema.methods.report = function(cb) {
  this.reports += 1;
  this.save(cb);
};

mongoose.model('Post', PostSchema);
