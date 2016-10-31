var app = angular.module('audelia', ['ui.router'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'MainCtrl',
          // resolve: {
          //   postPromise: ['posts', function(posts) {
          //     return posts.getAll();
          //   }]
          // }
        })

      .state('posts', {
        url: '/posts',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl',
        resolve:  {
          postPromise: ['posts', function(posts) {
            return posts.getAll();
          }]
        }
      })

      .state('postsId', {
        url: '/posts/{id}',
        templateUrl: '/postsId.html',
        controller: 'PostsIdCtrl',
        resolve: {
          post: ['$stateParams', 'posts', function($stateParams, posts) {
            return posts.get($stateParams.id);
          }]
        }
      })

      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        onEnter: ['state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })

      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthCtrl',
        onEnter: ['state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      });

        $urlRouterProvider.otherwise('home');
    }])

  .factory('auth', ['$http', '$window', function($http, $window) {
    var auth = {};

    auth.saveToken = function(token) {
      //unique key to always read/write from
      //changing it would log everyone out
      $window.localStorage['audelia-token'] = token;
    };

    auth.getToken = function() {
      return $window.localStorage['audelia-token'];
    }

    //retrive token
    //checks whether user is logged in
    auth.isLoggedIn = function() {
      var token = auth.getToken();

      if(token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Data.now() / 1000;
      } else {
        return false;
      }
    }

    auth.currentUser = function() {
      if (auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        //get us username from currently logged in user
        return payload.username;
      }
    }

    //saving token logs user in
    auth.register = function(user) {
      return $http.post('/register', user).success(function(data) {
        auth.saveToken(data.token);
      });
    }

    auth.logIn = function(user) {
      return $http.post('/login', user).success(function(data) {
        auth.saveToken(data.token);
      });
    }

    auth.logOut = function() {
      $window.localStorage.removeItem('audelia-token');
    }

    return auth;
  }])


  .factory('posts', ['$http', 'auth', function($http, auth){
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
      return $http.post('/posts', post, {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      }).success(function(data) {
        o.posts.push(data);
      });
    };

    o.addComment = function(id, comment) {
      return $http.post('/posts/' + id + '/comments', comment, {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      });
    };
    return o;
  }]);

  app.controller('AuthCtrl', [
      '$scope',
      '$state',
      '$auth',
      function($scope, $state, auth){
        $scope.user = {};

        $scope.register = function() {
          auth.register($scope.user).error(function(error){
            $scope.error = error;
          }).then(function(){
            $state.go('home');
          });
        };

        $scope.logIn = function(){
          auth.logIn($scope.user).error(function(error){
            $scope.error = error;
          }).then(function(){
            $state.go('home');
          });
        };
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
              postBody: $scope.postBody,
            });

            $scope.title = '';
            $scope.username = '';
            $scope.postBody = '';
          };
        }])

      app.controller('PostsIdCtrl', [
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
              author: 'user',
            }).success(function(comment) {
              $scope.post.comments.push(comment);
            });
            $scope.body = '';
          };
        }])

      app.controller('NavCtrl', [
        '$scope',
        '$auth',
        function($scope, auth){
          $scope.isLoggedIn = auth.isLoggedIn;
          $scope.currentUser = auth.currentUser;
          $scope.logOut = auth.logOut;
        }]);


// function hideBtn() {
//   document.getElementById(".all").style.visibility = hidden;
// }
