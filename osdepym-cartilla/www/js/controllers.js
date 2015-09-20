var controllers = angular.module('controllers', ['services', 'model']);

//TODO: Remove this and use AfiliadosController
controllers.controller('TestController', function(opcionesService, testService) {
    var viewModel = this;

    viewModel.nombre = 'Antes';
    viewModel.especialidades = opcionesService.getEspecialidades();

    viewModel.getRest = function() {
      testService.getUsuario('22755022', 'M', function(nombre) {
        viewModel.nombre = nombre;
      });
    };
});

controllers.controller('AfiliadosController', function(afiliadosService, actualizacionService) {
  var viewModel = this;

  viewModel.dni = '';
  viewModel.telefono = '';
  viewModel.sexo = '';

  viewModel.isRegistered = function() {
    var afiliado = afiliadosService.getAfiliado(viewModel.dni, viewModel.sexo);

    return afiliado != null;
  };
  viewModel.actualizarCartilla = function() {
    actualizacionService.actualizarCartilla(viewModel.dni, viewModel.sexo);
  };
});

controllers.controller('EspecialidadSearchController', function(opcionesService, prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.especialidades = opcionesService.getEspecialidades();
    viewModel.provincias = opcionesService.getProvincias();
    viewModel.localidades = opcionesService.getLocalidades();

    viewModel.especialidadSeleccionada = '';
    viewModel.provinciaSeleccionada = '';
    viewModel.localidadSeleccionada = '';

    viewModel.searchByEspecialidad = function() {
      var prestadores = prestadoresService.getPrestadoresByEspecialidad(viewModel.especialidadSeleccionada, viewModel.provinciaSeleccionada, viewModel.localidadSeleccionada);

      busquedaActual.setPrestadores(prestadores);
    };
});

controllers.controller('NombreSearchController', function(prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.nombre = '';

    viewModel.searchByNombre = function() {
      var prestadores = prestadoresService.getPrestadoresByNombre(viewModel.nombre);

      busquedaActual.setPrestadores(prestadores);
    };
});

controllers.controller('CercaniaSearchController', function(opcionesService, prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.especialidades = opcionesService.getEspecialidades();

    viewModel.especialidadSeleccionada = '';

    viewModel.searchByNombre = function() {
      //TODO: How to get current coordinates?
      var currentCoordinates = '';
      var prestadores = opcionesService.getPrestadoresByCercania(viewModel.especialidadSeleccionada, currentCoordinates);

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
