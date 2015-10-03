angular.module('app.routes', ['ngRoute'])
.config(function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/views/pages/home.html'
    })

    .when('/login', {
      templateUrl: 'app/views/pages/login.html',
      controller: 'mainController',
      controllerAs: 'login'
    })

    .when('/users', {
      templateUrl: 'app/views/pages/users/all.html',
      controller: 'userController',
      controllerAs: 'user'
    })

    .when('/killings', {
      templateUrl: 'app/views/pages/killings/all.html',
      controller: 'killingsController',
      controllerAs: 'killing'
    })

    .when('/register', {
      templateUrl: 'app/views/pages/users/single.html',
      controller: 'userCreateController',
      controllerAs: 'user'
    })

    .when('/users/:user_id', {
      templateUrl: 'app/views/pages/users/single.html',
      controller: 'userEditController',
      controllerAs: 'user'
    })

    .when('/killing/new', {
      templateUrl: 'app/views/pages/killings/create.html',
      controller: 'killingCreateController',
      controllerAs: 'killing'
    })

    .when('/killing/:killing_id', {
      templateUrl: 'app/views/pages/killings/create.html',
      controller: 'killingEditController',
      controllerAs: 'killing'
    });

  $locationProvider.html5Mode(true);
});
