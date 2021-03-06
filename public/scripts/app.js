
function hide() {
  console.log('clicked!');
  content = document.querySelector('ui-view');
  console.log(content);
  content.style.visibility = "hidden";
}

function show() {
  console.log('clicked!');
  content = document.querySelector('ui-view');
  console.log(content);
  content.style.visibility = "visible";
}


var app = angular.module('audelia', ['ui.router'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url:'/home',
          templateUrl: '/home.html',
        })

        .state('posts', {
          url: '/posts',
          templateUrl: '/posts.html',
          controller: 'MainCtrl',
          resolve: {
            postPromise: ['posts', function(posts) {
              return posts.getAll();
            }]
          }
        })

        .state('post', {
          url: '/posts/{id}',
          templateUrl: '/post.html',
          controller: 'PostsCtrl',
          resolve: {
            post: ['$stateParams', 'posts', function($stateParams, posts) {
              return posts.get($stateParams.id);
            }]
          }
        })

        .state('newPost', {
          url: '/newPost',
          templateUrl: '/newPost.html',
          controller: 'MainCtrl',
          resolve: {
            postPromise: ['posts', function(posts) {
              return posts.getAll();
            }]
          }
        })

        .state('events', {
          url: '/events',
          templateUrl: '/events.html'
        })

        .state('share', {
          url: '/share',
          templateUrl: '/share.html'
        });

        $urlRouterProvider.otherwise('home');
    }])

  app.factory('posts', ['$http', function($http){
    var o = {
      posts: []
    };
    o.getAll = function() {
      return $http.get('/posts').success(function(data) {
        angular.copy(data, o.posts);
      });
    };

    o.get = function(id) {
      return $http.get('/posts/' + id).then(function(res) {
        return res.data;
      });
    };

    o.create = function(post) {
      return $http.post('/posts', post).success(function(data) {
        o.posts.push(data);
      });
    };

    o.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment);
    };

    o.report = function(post) {
      return $http.put('/posts/' + post._id + '/report').success(function(data){
        post.reports += 1;
      });
    };

    o.reportComment = function(post, comment) {
      return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/report').success(function(data){
        comment.reports += 1;
      });
    };

    return o;
  }])

  app.controller('MainCtrl', [
    '$scope',
    'posts',
    function($scope, posts){

      $scope.posts = posts.posts;


      $scope.addPost = function() {
        if (!$scope.title || $scope.title === '') { return; }
        posts.create({
          title: $scope.title,
          username: $scope.username,
          body: $scope.body,
        });

        $scope.title = '';
        $scope.username = '';
        $scope.body = '';
      };

      $scope.incrementReports = function(post) {
        posts.report(post);
      };
    }])

  app.controller('PostsCtrl', [
      '$scope',
      'posts',
      'post',
    function($scope, posts, post) {
      $scope.post = post;
      //
      $scope.addComment = function() {
        if ($scope.body === '') { return; }
        posts.addComment(post._id, {
          body: $scope.body,
        }).success(function(comment) {
          $scope.post.comments.push(comment);
        });
        $scope.body = '';
      };

      $scope.incrementReports = function(comment) {
        posts.reportComment(post, comment);
      };
    }])
