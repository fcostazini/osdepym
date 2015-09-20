var controllers = angular.module('controllers', ['services', 'model']);

//TODO: Remove this and use AfiliadosController
controllers.controller('TestController', function(opcionesService, testService) {
    var viewModel = this;

    viewModel.nombre = 'Antes';
    viewModel.especialidades = [];

    opcionesService
      .getEspecialidadesAsync()
      .then(function onSuccess(especialidades) {
        viewModel.especialidades = especialidades;
      }, function onError(error) {
        //TODO: Error handling
      });

    viewModel.getRest = function() {
      testService
        .getUsuarioAsync('22755022', 'M')
        .then(function onSuccess(usuario) {
          viewModel.nombre = usuario.nombre;
        }, function onError(error) {
          alert(JSON.stringify(error));
        });
    };
});

controllers.controller('AfiliadosController', function(afiliadosService, actualizacionService) {
  var viewModel = this;

  viewModel.dni = '';
  viewModel.telefono = '';
  viewModel.sexo = '';
  viewModel.isRegistered = false;
  viewModel.cartillaActualizada = false;

  viewModel.checkAfiliado = function() {
    afiliadosService
      .getAfiliadoAsync(viewModel.dni, viewModel.sexo)
      .then(function onSuccess(afiliado) {
          viewModel.isRegistered = afiliado != null;
        }, function onError(error) {
          //TODO: Error handling
        });
  };
  viewModel.actualizarCartilla = function() {
    actualizacionService
      .actualizarCartillaAsync(viewModel.dni, viewModel.sexo)
      .then(function onSuccess(actualizada) {
           viewModel.cartillaActualizada = actualizada;
        }, function onError(error) {
          //TODO: Error handling
        });
  };
});

controllers.controller('EspecialidadSearchController', function(opcionesService, prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.especialidades = [];
    viewModel.provincias = [];
    viewModel.localidades = [];

    opcionesService
      .getEspecialidadesAsync()
      .then(function onSuccess(especialidades) {
        viewModel.especialidades = especialidades;
      }, function onError(error) {
        //TODO: Error handling
      });

    opcionesService
      .getProvinciasAsync()
      .then(function onSuccess(provincias) {
        viewModel.provincias = provincias;
      }, function onError(error) {
        //TODO: Error handling
      });

    opcionesService
      .getLocalidadesAsync()
      .then(function onSuccess(localidades) {
        viewModel.localidades = localidades;
      }, function onError(error) {
        //TODO: Error handling
      });

    viewModel.especialidadSeleccionada = '';
    viewModel.provinciaSeleccionada = '';
    viewModel.localidadSeleccionada = '';

    viewModel.searchByEspecialidad = function() {
      prestadoresService
        .getPrestadoresByEspecialidadAsync(viewModel.especialidadSeleccionada, viewModel.provinciaSeleccionada, viewModel.localidadSeleccionada)
        .then(function onSuccess(prestadores) {
          busquedaActual.setPrestadores(prestadores);
        }, function onError(error) {
          //TODO: Error handling
        });
    };
});

controllers.controller('NombreSearchController', function(prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.nombre = '';

    viewModel.searchByNombre = function() {
      prestadoresService.getPrestadoresByNombreAsync(viewModel.nombre)
        .then(function onSuccess(prestadores) {
            busquedaActual.setPrestadores(prestadores);
          }, function onError(error) {
            //TODO: Error handling
          });
    };
});

controllers.controller('CercaniaSearchController', function(opcionesService, prestadoresService, busquedaActual) {
    var viewModel = this;

    viewModel.especialidades = [];

    opcionesService
      .getEspecialidadesAsync()
      .then(function onSuccess(especialidades) {
        viewModel.especialidades = especialidades;
      }, function onError(error) {
        //TODO: Error handling
      });

    viewModel.especialidadSeleccionada = '';

    viewModel.searchByNombre = function() {
      //TODO: How to get current coordinates?
      var currentCoordinates = '';

      opcionesService.getPrestadoresByCercaniaAsync(viewModel.especialidadSeleccionada, currentCoordinates)
        .then(function onSuccess(prestadores) {
            busquedaActual.setPrestadores(prestadores);
          }, function onError(error) {
            //TODO: Error handling
          });
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
