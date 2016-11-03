
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  comment: String,
  body: String,
  reports: { type: Number, default: 0 },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});


CommentSchema.methods.report = function(cb) {
  this.reports == 1;
  this.save(cb);
}
mongoose.model('Comment', CommentSchema);
