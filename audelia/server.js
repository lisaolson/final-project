//SERVER-SIDE JAVASCRIPT

//require express in app
var express = require('express');
//generate new express app called 'app'
var app = express();

require('./models/Posts');
require('./models/Comments');

//serve static files from public folder
app.use(express.static(__dirname + '/public'));


var controllers = require('./controllers');

//ROUTES

//JSON Endpoints


var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

app.get('/', function homepage (req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) { next(err); }

    res.json(posts);
  })
});

app.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if (err) {return next(err); }

    res.json(post);
  });
});

app.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post) {
    if (err) { return next(err); }

    req.post = post;
    return next();
  })
});

app.get('/posts/:post', function(req, res) {
  req.post.populate('comments', function(err, post) {
      res.json(req.post);
  });
});

app.post('/posts/:posts/comments', function(req, res, next){
  var comment = new Comment(req.body);
  comment.post = req.post;

  comment.save(function(err, comment) {
    if (err) { return next(err); }

    req.post.comments.push(comment);
    req.post.save(function(err, post) {
      if (err) { return next(err); }

      res.json(comment);
    });
  });
});

app.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, post) {
    if (err) { return next(err); }

    req.comment = comment;
    return next();
  });
});


//SERVER


//listen on port 3000

app.listen(process.env.PORT || 3000, function() {
  console.log('Express server is running on http://localhost:3000');
});
