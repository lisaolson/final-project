var app = angular.module('audelia', []);

app.controller('MainCtrl', [
  '$scope',

  function ($scope){
    $scope.test = 'Hello World!';
  }
])
