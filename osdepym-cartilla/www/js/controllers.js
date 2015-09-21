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

controllers.controller('MapCtrl', function($scope, $ionicLoading) {

  $scope.map  = null;

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.centerOnMe();
  };

  $scope.centerOnMe = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide()
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  $scope.crearMarker = function(){
      var myLatLng = {lat: -34.619247, lng: -58.438518};

      var marker = new google.maps.Marker({
          position: myLatLng,
          map: $scope.map,
          title: '.CEPRESALUD'
       });

      var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
            '<div id="bodyContent">'+
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the '+
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
            'south west of the nearest large town, Alice Springs; 450&#160;km '+
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
            'features of the Uluru - Kata Tjuta National Park. Uluru is '+
            'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
            'Aboriginal people of the area. It has many springs, waterholes, '+
            'rock caves and ancient paintings. Uluru is listed as a World '+
            'Heritage Site.</p>'+
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
            '(last visited June 22, 2009).</p>'+
            '</div>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        marker.addListener('click', function() {
          infowindow.open($scope.map, marker);
        });
  };
});
