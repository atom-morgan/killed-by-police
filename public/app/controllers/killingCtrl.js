angular.module('killingCtrl', ['killingService', 'datetime'])
.controller('killingsController', function(Killing, $scope) {
  var vm = this;

  vm.processing = true;

  vm.d3data = [
    {name: "Greg", score: 98},
    {name: "Ari", score: 96},
    {name: 'Q', score: 75},
    {name: "Loser", score: 48}
  ];

  vm.d3OnClick = function(item) {
    console.log('clicked item ', item);
    $scope.$apply(function() {
      if (!$scope.showDetailPanel) {
        $scope.showDetailPanel = true;
        $scope.detailItem = item;
      }
    });
  }

  Killing.all()
    .success(function(data) {
      vm.processing = false;
      vm.killings = data;
    });

  vm.deleteUser = function(id) {
    vm.processing = true;
    Killing.delete(id)
      .success(function(data) {
        if (data.success) {
          Killing.all()
            .success(function(data) {
              vm.processing = false;
              vm.killings = data;
            });
        }
      });
  };
})

.controller('killingCreateController', function(Killing) {
  var vm = this;

  vm.type = 'create';
  vm.processing = true;

  // vm.test.map(function(killing) {
  //   vm.killingData = killing;
  //   Killing.create(vm.killingData);
  //   console.log("vm.killingData is ", vm.killingData);
  // });

  vm.submit = function() {
    Killing.create(vm.killingData)
      .success(function(data) {
        vm.processing = false;
        vm.message = data.message;
      });
  };
})

.controller('killingEditController', function(Killing, $routeParams, $location, datetime) {
  var vm = this;

  //console.log('parser is ', parser);

  vm.type = 'edit';
  vm.processing = true;

  Killing.findById($routeParams.killing_id)
    .success(function(data) {
      console.log('date ', data.reported_date);
      var parser = datetime("MM-DD-YYYY");
      parser.setDate(data.reported_date);
      console.log('format ', parser.format);
      vm.processing = false;
      vm.killingData = data;
    });

  vm.submit = function() {
    vm.processing = true;
    Killing.update(vm.killingData._id, vm.killingData)
      .success(function(data) {
        vm.processing = false;
        vm.message = data.message;
        if (data.success) {
          $location.path('/killings');
        }
      });
  };
});
