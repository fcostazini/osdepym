var controllers = angular.module('controllers', ['services']);

controllers.controller('HomeController', function(filtrosService, httpService) {
    var viewModel = this;

    viewModel.nombre = 'Antes';
    viewModel.especialidades = filtrosService.getEspecialidades();

    viewModel.getRest = function() {
      httpService.getUsuario('22755022', 'M', function(nombre) {
        viewModel.nombre = nombre;
      }
    });
});

controllers.controller('AfiliadosController', function(afiliadosService) {
  var viewModel = this;

  viewModel.dni = "";
  viewModel.telefono = "";
  viewModel.sexo = "";

  viewModel.isRegistered = function() {
    return afiliadosService.hasAfiliado(viewModel.dni);
  };
});

controllers.controller('EspecialidadSearchController', function(filtrosService, prestadoresService, busquedaActual) {
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
});

controllers.controller('NombreSearchController', function(prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.nombre = "";

    viewModel.searchByNombre = function() {
      var prestadores = prestadoresService.getPrestadoresByNombre(viewModel.nombre);

      busquedaActual.setPrestadores(prestadores);
    };
});

controllers.controller('CercaniaSearchController', function(filtrosService, prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.especialidades = filtrosService.getEspecialidades();

    viewModel.especialidadSeleccionada = "";

    viewModel.searchByNombre = function() {
      //TODO: How to get current coordinates?
      var currentCoordinates = "";
      var prestadores = filtrosService.getPrestadoresByCercania(viewModel.especialidadSeleccionada, currentCoordinates);

      busquedaActual.setPrestadores(prestadores);
    };
});

controllers.controller('ResultadoBusquedaController', function(busquedaActual) {
  var viewModel = this;

  viewModel.prestadores = busquedaActual.getPrestadores();

  viewModel.seleccionarPrestador = function(prestador) {
    busquedaActual.seleccionarPrestador(prestador);
  };
});

controllers.controller('DetallePrestadorController', function(busquedaActual) {
  var viewModel = this;

  viewModel.prestador = busquedaActual.getPrestadorActual();
});
