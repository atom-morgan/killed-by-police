angular.module('userCtrl', ['userService'])
.controller('userController', function(User) {
  var vm = this;

  vm.processing = true;

  User.all()
    .success(function(data) {
      vm.processing = false;

      vm.users = data;
    });

  vm.deleteUser = function(id) {
    vm.processing = true;

    User.delete(id)
      .success(function(data) {

        //get an updated list of users
        User.all()
          .success(function(data) {
            vm.processing = false;
            vm.users = data;
          });
      });
  };

})

.controller('userCreateController', function(User) {
  var vm = this;

  //variable to hide/show elements of the view
  //differentiates between create or edit pages
  vm.type = 'create';

  vm.saveUser = function() {
    vm.processing = true;

    vm.message = '';

    User.create(vm.userData)
      .success(function(data) {
        vm.processing = false;

        vm.userData = {};
        vm.message = data.message;
      });
  };

})

.controller('userEditController', function($routeParams, User) {
  var vm = this;

  vm.type = 'edit';

  //get user data for the user to edit
  //grab id from url via $routeParams
  User.get($routeParams.user_id)
    .success(function(data) {
      vm.userData = data;
    });

  vm.saveUser = function() {
    vm.processing = true;
    vm.message = '';

    User.update($routeParams.user_id, vm.userData)
      .success(function(data) {
        vm.processing = false;

        vm.userData = {};

        vm.message = data.message;
      });
  };

});
