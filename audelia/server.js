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

//HTML Endpoints

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
//JSON Endpoints

// app.get('/posts', controllers.posts.index);

//SERVER


//listen on port 3000

app.listen(process.env.PORT || 3000, function() {
  console.log('Express server is running on http://localhost:3000');
});
