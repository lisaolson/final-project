var app = angular.module('audelia', []);
  app.controller('MainCtrl', [
    '$scope',
    function($scope){

      $scope.posts = [
        {title: 'post 1', username: 'thatsme', postInput: 'whatever i decided to write'},
        {title: 'post 1', username: 'thatsme', postInput: 'whatever i decided to write'},
      ];

      $scope.addPost = function() {
        $scope.posts.push({
          title: $scope.title,
          username: $scope.username,
          postInput: $scope.postInput
        });
      }
    }]);
