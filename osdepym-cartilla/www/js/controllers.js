angular.module('starter.controllers', [])

 .controller('HomeController', function($scope, $http) {

    $scope.getRest = function() {
       $http.get('http://www.osdepym.com.ar:8080/OSDEPYM_CartillaWeb2/rest/mobile/getAfiliado?dni=22755022&sexo=M').then(function(resp) {
             alert(JSON.stringify(resp));
       }, function(err) {
          alert(JSON.stringify(err));
       })
    };

  });
