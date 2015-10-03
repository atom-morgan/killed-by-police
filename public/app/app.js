angular.module('userApp', [
  'ngAnimate',
  'app.routes',
  'authService',
  'mainCtrl',
  'userCtrl',
  'killingCtrl',
  'userService',
  'killingService',
  'd3',
  'd3.directives',
  'datetime'
])

.config(function($httpProvider) {
  //attach auth interceptor to http requests
  $httpProvider.interceptors.push('AuthInterceptor');
});
