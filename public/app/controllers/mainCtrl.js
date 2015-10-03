angular.module('mainCtrl', [])
.controller('mainController', function($rootScope, $location, Auth) {
  var vm = this;

  vm.loggedIn = Auth.isLoggedIn();

  //check to see if a user is logged in on every request
  $rootScope.$on('$routeChangeStart', function() {
    vm.loggedIn = Auth.isLoggedIn();

    Auth.getUser()
      .then(function(data) {
        vm.user = data.data;
      });
  });

  //handles login form
  vm.doLogin = function() {
    vm.processing = true;

    Auth.login(vm.loginData.username, vm.loginData.password)
      .success(function(data) {
        vm.processing = false;
        if (data.success) {
          $location.path('/users');
        } else {
          vm.error = data.message;
        }
      });
  };

  vm.doLogout = function() {
    Auth.logout();
    vm.user = {};
    $location.path('/login');
  };

});
