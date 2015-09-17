var controllers = angular.module('controllers', ['services']);

controllers.controller('HomeController', ['$http', 'filtrosService', function($http, filtrosService) {
    var viewModel = this;

    viewModel.especialidades = filtrosService.getEspecialidades();

    viewModel.getRest = function() {
       $http.get('http://www.osdepym.com.ar:8080/OSDEPYM_CartillaWeb2/rest/mobile/getAfiliado?dni=22755022&sexo=M')
       .then(function(resp) {
             alert(JSON.stringify(resp));
       }, function(err) {
          alert(JSON.stringify(err));
       });
    };
}]);

controllers.controller('AfiliadosController', ['afiliadosService', function(afiliadosService) {
  var viewModel = this;

  viewModel.dni = "";
  viewModel.telefono = "";
  viewModel.sexo = "";

  viewModel.isRegistered = function() {
    return afiliadosService.hasAfiliado(viewModel.dni);
  };
}]);

controllers.controller('EspecialidadSearchController', ['filtrosService', 'prestadoresService', 'busquedaActual',
  function(filtrosService, prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.especialidades = filtrosService.getEspecialidades();
    viewModel.provincias = filtrosService.getProvincias();
    viewModel.localidades = filtrosService.getLocalidades();

    viewModel.especialidadSeleccionada = "";
    viewModel.provinciaSeleccionada = "";
    viewModel.localidadSeleccionada = "";

    viewModel.searchByEspecialidad = function() {
      var prestadores = prestadoresService.getPrestadoresByEspecialidad(viewModel.especialidadSeleccionada, viewModel.provinciaSeleccionada, viewModel.localidadSeleccionada);

      busquedaActual.setPrestadores(prestadores);
    };
}]);

controllers.controller('NombreSearchController', ['prestadoresService', 'busquedaActual',
  function(prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.nombre = "";

    viewModel.searchByNombre = function() {
      var prestadores = prestadoresService.getPrestadoresByNombre(viewModel.nombre);

      busquedaActual.setPrestadores(prestadores);
    };
}]);

controllers.controller('CercaniaSearchController', ['filtrosService', 'prestadoresService', 'busquedaActual',
  function(filtrosService, prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.especialidades = filtrosService.getEspecialidades();

    viewModel.especialidadSeleccionada = "";

    viewModel.searchByNombre = function() {
      //TODO: How to get current coordinates?
      var currentCoordinates = "";
      var prestadores = filtrosService.getPrestadoresByCercania(viewModel.especialidadSeleccionada, currentCoordinates);

      busquedaActual.setPrestadores(prestadores);
    };
}]);

controllers.controller('ResultadoBusquedaController', ['busquedaActual', function(busquedaActual) {
  var viewModel = this;

  viewModel.prestadores = busquedaActual.getPrestadores();

  viewModel.seleccionarPrestador = function(prestador) {
    busquedaActual.seleccionarPrestador(prestador);
  };
}]);

controllers.controller('DetallePrestadorController', ['busquedaActual', function(busquedaActual) {
  var viewModel = this;

  viewModel.prestador = busquedaActual.getPrestadorActual();
}]);
