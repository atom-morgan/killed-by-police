angular.module('killingService', [])
.factory('Killing', function($http) {
  var killingFactory = {};

  killingFactory.all = function() {
    return $http.get('/api/killings/');
  };

  killingFactory.create = function(data) {
    return $http.post('/api/killing/', data);
  };

  killingFactory.findById = function(id) {
    return $http.get('/api/killing/' + id);
  };

  killingFactory.update = function(id, data) {
    return $http.put('/api/killing/' + id, data);
  };

  killingFactory.delete = function(id) {
    return $http.delete('/api/killing/' + id);
  };

  return killingFactory;

});
