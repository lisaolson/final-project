var postList =[];
postList.push({
              title: 'Nine Inch Nails',
              username: 'The Downward Spiral',
              body: '1994, March 8',
            });
postList.push({
              title: 'Metallica',
              username: 'Metallica',
              body: '1991, August 12',
            });
postList.push({
              title: 'The Prodigy',
              username: 'Music for the Jilted Generation',
              body: '1994, July 4',
            });
postList.push({
              title: 'Johnny Cash',
              username: 'Unchained',
              body: '1996, November 5',
            });

db.Post.remove({}, function(err, albums){

  db.Post.create(postList, function(err, posts){
    if (err) { return console.log('ERROR', err); }
    console.log("all posts:", posts);
    console.log("created", posts.length, "posts");
    process.exit();
  });

});
