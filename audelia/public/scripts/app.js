var app = angular.module('audelia', ['ui.router'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'MainCtrl'
        })

        .state('posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
          controller: 'PostsCtrl'
        });

        $urlRouterProvider.otherwise('home');
    }])
  .factory('posts', [function(){
    var o = {
      posts: []
    };
    return o;
  }])

  app.controller('MainCtrl', [
    '$scope',
    'posts',
    function($scope, posts){

      $scope.posts = posts.posts;

      $scope.addPost = function() {
        if ($scope.title === '') { return; }
        $scope.posts.push({
          title: $scope.title,
          username: $scope.username,
          postInput: $scope.postInput,
          comments: [
            {author: 'Joe', body: 'Cool post'},
            {author: 'Bob', body: 'All wrong'}
          ]
        });

        $scope.title = '';
        $scope.username = '';
        $scope.postInput = '';
      }
    }])

  app.controller('PostsCtrl', [
      '$scope',
      '$stateParams',
      'posts',
    function($scope, $stateParams, posts) {
      $scope.post = posts.posts[$stateParams.id];
      //
      $scope.addComment = function() {
        if ($scope.body === '') { return; }
        $scope.post.comments.push({
          body: $scope.body,
          author: 'user'
        });
        $scope.body = '';
      }
    }]);
