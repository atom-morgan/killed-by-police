angular.module('authService', [])
.factory('Auth', function($http, $q, AuthToken) {
  var authFactory = {};

  authFactory.login = function(username, password) {
    return $http.post('/api/authenticate', {
      username: username,
      password: password
    })
      .success(function(data) {
        AuthToken.setToken(data.token);
        return data;
      });
  };

  authFactory.logout = function() {
    AuthToken.setToken();
  };

  authFactory.isLoggedIn = function() {
    if (AuthToken.getToken()) {
      return true;
    } else {
      return false;
    }
  };

  authFactory.getUser = function() {
    if (AuthToken.getToken()) {
      return $http.get('/api/me', { cache: true });
    } else {
      return $q.reject({ message: 'User has no token.' });
    }
  };

  return authFactory;
})

.factory('AuthToken', function($window) {
  var authTokenFactory = {};

  //get token out of local storage
  authTokenFactory.getToken = function() {
    return $window.localStorage.getItem('token');
  };

  //if a token is passed, set the token
  //if there is no token, clear it from local storage
  authTokenFactory.setToken = function(token) {
    if(token) {
      $window.localStorage.setItem('token', token);
    } else {
      $window.localStorage.removeItem('token');
    }
  };

  return authTokenFactory;
})

.factory('AuthInterceptor', function($q, $location, AuthToken) {
  var interceptorFactory = {};

  //this will happen on all HTTP requests
  interceptorFactory.request = function(config) {
    var token = AuthToken.getToken();

    if (token) {
      config.headers['x-access-token'] = token;
    }

    return config;
  };

  //happens on response errors
  interceptorFactory.responseError = function(response) {
    if (response.status == 403) {
      AuthToken.setToken();
      $location.path('/login');
    }

   //return errors form the server as a promise
    return $q.reject(response);
  };

  return interceptorFactory;
});
