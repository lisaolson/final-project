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
          postInput: $scope.postInput
        });
        $scope.title = '';
        $scope.username = '';
        $scope.postInput = '';
      }
    }]);
