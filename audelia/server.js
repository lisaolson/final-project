//SERVER-SIDE JAVASCRIPT

//require express in app
var express = require('express');
//generate new express app called 'app'
var app = express();

var bodyParser = require('body-parser');
var passport = require('passport');


//serve static files from public folder
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(passport.initialize());
var mongoose = require('mongoose');
require('./models/Posts');
require('./models/Comments');
require('./models/Users');
require('./config/passport');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/audelia');
  //


app.get('/', function homepage (req, res){
  res.sendFile(__dirname + '/index.html');
});


app.post('/register', function(req, res, next) {
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()})
  });
});

app.get('/posts', function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) { return next(err); }

    res.json(posts);
  });
});

app.post('/posts/', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post) {
    if (err) { return next(err); }

    res.json(post);
  });
});

app.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post) {
    if (err) { return next(err); }

    req.post = post;
    return next();
  });
});

app.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment) {
    if (err) { return next(err); }

    req.comment = comment;
    return next();
  });
});



app.post('/posts/:post/comments', function(req, res, next){
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



app.get('/posts/:post', function(req, res) {
  req.post.populate('comments', function(err, post) {
    if(err) { return next(err); }

      res.json(req.post);
  });
});

//listen on port 3000

app.listen(process.env.PORT || 3000, function() {
  console.log('Express server is running on http://localhost:3000');
});
