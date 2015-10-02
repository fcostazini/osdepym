var controllers = angular.module('controllers', ['services', 'model']);

controllers.controller('NavigationController', function ($ionicSideMenuDelegate, $ionicHistory, $log, $location, $state, $timeout, actualizacionService, busquedaActual) {
  var viewModel = this;

  viewModel.back = function () {
    if($state.current.name =="cartilla"){

      $location.path("home");
    } else {
      $ionicHistory.goBack();
    }
  };

  viewModel.menu = function() {
    $ionicSideMenuDelegate.toggleRight();
  };

  viewModel.actualizar = function(){
    actualizacionService.actualizarCartillaAsync(busquedaActual.getAfiliadoLogueado().dni, busquedaActual.getAfiliadoLogueado().sexo)
      .then(function onSuccess(actualizada) {
        viewModel.cartillaActualizada = actualizada;
      }, function onError(error) {
        var message = '';

        if (error instanceof cartilla.exceptions.ServiceException) {
          message = error.getMessage();

          if (error.getInnerException()) {
            message += ' - ' + error.getInnerException().getMessage();
          }
        } else {
          message = 'Ocurrió un error inesperado al actualizar la cartilla';
        }

        alert(message);
        $log.error(message);
      });
  };

  viewModel.goTo = function (view, delay) {
    $timeout(function() {
        $location.path(view);
    }, delay ? delay : 0);
  };

  viewModel.isRoot = function () {
    return $state.current.name != 'login' && $state.current.name != 'home';
  }
});

controllers.controller('LoginController', function (afiliadosService, $ionicHistory, $location, $log, busquedaActual, $ionicLoading) {
  var viewModel = this;

  viewModel.dni = '';
  viewModel.tel = '';
  viewModel.genero = '';

  afiliadosService
    .getAfiliadoLogueadoAsync()
    .then(function onSuccess(afiliado) {
      if(afiliado) {
        busquedaActual.setAfiliadoLogueado(afiliado);

        $ionicHistory.nextViewOptions({
          disableBack: true
        });

        $location.path("home");
      }
    }, function onError(error) {
      //TODO: Exception Handling
    });


  viewModel.login = function () {

    $ionicLoading.show({
        content: 'Buscando Afiliado',
        showBackdrop: false
    });
    afiliadosService
      .getAfiliadoAsync(viewModel.dni, viewModel.genero)
      .then(function onSuccess(afiliado) {

        if (afiliado) {
          afiliadosService
            .loguearAfiliadoAsync (afiliado)
            .then(function onSuccess(logueado) {
              if(logueado) {
                $ionicHistory.nextViewOptions({
                  disableBack: true
                });
                $ionicLoading.hide();
                $location.path("home");
              } else {
                //TODO: What should we do here?
              }
            }, function onError(error) {
             //TODO: Exception handling
            });
        } else {
          $ionicLoading.hide();
          alert("Afiliado incorrecto");
        }
      }, function onError(error) {

        var message = '';

        if (error instanceof cartilla.exceptions.ServiceException) {
          message = error.getMessage();

          if (error.getInnerException()) {
            message += ' - ' + error.getInnerException().getMessage();
          }
        } else {
          if(error.getMessage() != undefined){
            message = error.getMessage();
          }
          else{
            message = 'Ocurrió un error inesperado al buscar afiliados';
          }

        }
        $ionicLoading.hide();
        alert(message);
        $log.error(message);
      });
  };
});

controllers.controller('AfiliadosController', function (afiliadosService, actualizacionService, $log) {
  var viewModel = this;

  viewModel.dni = '';
  viewModel.telefono = '';
  viewModel.sexo = '';
  viewModel.isRegistered = false;
  viewModel.cartillaActualizada = false;

  viewModel.checkAfiliado = function () {
    afiliadosService
      .getAfiliadoAsync(viewModel.dni, viewModel.sexo)
      .then(function onSuccess(afiliado) {
        viewModel.isRegistered = afiliado != null;
      }, function onError(error) {
        var message = '';

        if (error instanceof cartilla.exceptions.ServiceException) {
          message = error.getMessage();

          if (error.getInnerException()) {
            message += ' - ' + error.getInnerException().getMessage();
          }
        } else {
          message = 'Ocurrió un error inesperado al buscar afiliados';
        }

        $log.error(message);
      });
  };

  viewModel.actualizarCartilla = function () {
    actualizacionService
      .actualizarCartillaAsync(viewModel.dni, viewModel.sexo)
      .then(function onSuccess(actualizada) {
        viewModel.cartillaActualizada = actualizada;
      }, function onError(error) {
        //TODO: Error handling
      });
  };
});

controllers.controller('EspecialidadSearchController', function (opcionesService, prestadoresService, busquedaActual, $log, $location) {
  var viewModel = this;
  viewModel.isDisabled = true;
  var handle = function (error, descriptionBusqueda) {
    var message = '';

    if (error instanceof cartilla.exceptions.ServiceException) {
      message = error.getMessage();

      if (error.getInnerException()) {
        message += ' - ' + error.getInnerException().getMessage();
      }
    } else {
      message = 'Ocurrió un error inesperado al buscar ' + descriptionBusqueda;
    }

    $log.error(message);
  };

  viewModel.especialidades = [];
  viewModel.provincias = [];
  viewModel.localidades = [];

  viewModel.especialidadSeleccionada = '';
  viewModel.provinciaSeleccionada = '';
  viewModel.localidadSeleccionada = '';

  opcionesService
    .getEspecialidadesAsync()
    .then(function onSuccess(especialidades) {
      viewModel.especialidades = especialidades;

      if (especialidades && especialidades[0]) {
        viewModel.especialidadSeleccionada = especialidades[0].getNombre();
      }
    }, function onError(error) {
      handle(error, cartilla.constants.filtrosBusqueda.ESPECIALIDADES);
    });

  opcionesService
    .getProvinciasAsync()
    .then(function onSuccess(provincias) {
      viewModel.provincias = provincias;
    }, function onError(error) {
      handle(error, cartilla.constants.filtrosBusqueda.PROVINCIAS);
    });

  opcionesService
    .getLocalidadesAsync()
    .then(function onSuccess(localidades) {
      viewModel.localidades = localidades;
    }, function onError(error) {
      handle(error, cartilla.constants.filtrosBusqueda.LOCALIDADES);
    });

  viewModel.searchByEspecialidad = function () {
    prestadoresService
      .getPrestadoresByEspecialidadAsync(viewModel.especialidadSeleccionada, viewModel.provinciaSeleccionada, viewModel.localidadSeleccionada)
      .then(function onSuccess(prestadores) {
        busquedaActual.setPrestadores(prestadores);
        busquedaActual.setTipoBusqueda(cartilla.constants.tiposBusqueda.ESPECIALIDAD);
        $location.path("resultados");
      }, function onError(error) {
        handle(error, cartilla.constants.filtrosBusqueda.PRESTADORES);
      });
  };
  setTimeout(function(){viewModel.isDisabled = false},200);
});

controllers.controller('NombreSearchController', function (prestadoresService, busquedaActual, $log, $location) {
  var viewModel = this;

  viewModel.nombre = '';

  viewModel.searchByNombre = function () {
    prestadoresService.getPrestadoresByNombreAsync(viewModel.nombre)
      .then(function onSuccess(prestadores) {
        busquedaActual.setPrestadores(prestadores);
        busquedaActual.setTipoBusqueda(cartilla.constants.tiposBusqueda.NOMBRE);
        $location.path("resultados");
      }, function onError(error) {
        var message = '';

        if (error instanceof cartilla.exceptions.ServiceException) {
          message = error.getMessage();

          if (error.getInnerException()) {
            message += ' - ' + error.getInnerException().getMessage();
          }
        } else {
          message = 'Ocurrió un error inesperado al buscar prestadores';
        }

        $log.error(message);
      });
  };
});

controllers.controller('CercaniaSearchController', function (opcionesService, prestadoresService, busquedaActual, $log, $location) {
  var viewModel = this;

  var handle = function (error, descriptionBusqueda) {
    var message = '';

    if (error instanceof cartilla.exceptions.ServiceException) {
      message = error.getMessage();

      if (error.getInnerException()) {
        message += ' - ' + error.getInnerException().getMessage();
      }
    } else {
      message = 'Ocurrió un error inesperado al buscar ' + descriptionBusqueda;
    }

    $log.error(message);
  };

  viewModel.especialidades = [];
  viewModel.especialidadSeleccionada = '';

  opcionesService
    .getEspecialidadesAsync()
    .then(function onSuccess(especialidades) {
      viewModel.especialidades = especialidades;

      if (especialidades && especialidades[0]) {
        viewModel.especialidadSeleccionada = especialidades[0].getNombre();
      }
    }, function onError(error) {
      handle(error, cartilla.constants.filtrosBusqueda.ESPECIALIDADES);
    });

  viewModel.searchByEspecialidad = function () {
    prestadoresService
      .getPrestadoresByEspecialidadAsync(viewModel.especialidadSeleccionada, '', '')
      .then(function onSuccess(prestadores) {
        busquedaActual.setPrestadores(prestadores);
        busquedaActual.setTipoBusqueda(cartilla.constants.tiposBusqueda.CERCANIA);
        $location.path("mapa");
      }, function onError(error) {
        handle(error, cartilla.constants.filtrosBusqueda.PRESTADORES);
      });
  };
});

controllers.controller('ResultadoBusquedaController', function (busquedaActual, $location) {
  var viewModel = this;

  viewModel.busquedaActual = busquedaActual;
  viewModel.titulo = "RESULTADO POR " + busquedaActual.getTipoBusqueda().toUpperCase();

  viewModel.seleccionarPrestador = function (prestador) {
    busquedaActual.seleccionarPrestador(prestador);

    $location.path("detallePrestador");
  };
});

controllers.controller('DetallePrestadorController', function (busquedaActual, $cordovaGeolocation, $ionicLoading) {
  var viewModel = this;

  viewModel.busquedaActual = busquedaActual;
  viewModel.titulo = "RESULTADO POR " + busquedaActual.getTipoBusqueda().toUpperCase();
  viewModel.prestador = busquedaActual.getPrestadorActual();

  viewModel.getTelefonoContacto = function () {
    var strTel = viewModel.prestador.getTelefonos()[0];

    return strTel.trim().replace(/ /g, '').replace(/\(54\)/g, '').replace(/\(/g, '').replace(/\)/g, '')
  };

  viewModel.collapseIcon = "ion-chevron-down";
  viewModel.isCollapsed = true;

  viewModel.toggleCollapse = function () {
    if (this.isCollapsed) {
      this.collapseIcon = "ion-chevron-up";
    } else {
      this.collapseIcon = "ion-chevron-down";
    }
    this.isCollapsed = !this.isCollapsed;
  }

  viewModel.map = null;

  viewModel.mapCreated = function (map) {
    viewModel.map = map;

    var myLatLng = {
      lat: busquedaActual.getPrestadorActual().getCoordenadas().latitud,
      lng: busquedaActual.getPrestadorActual().getCoordenadas().longitud
    };

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: map,
      title: busquedaActual.getPrestadorActual().getNombre()
    });
    map.setCenter(new google.maps.LatLng(busquedaActual.getPrestadorActual().getCoordenadas().latitud, busquedaActual.getPrestadorActual().getCoordenadas().longitud));
  };
});

controllers.controller('MapCtrl', function (prestadoresService, busquedaActual, $scope, $ionicLoading, $cordovaGeolocation) {

  $scope.map = null;
  $scope.distancias =[{name:"1 km",value:1},{name:"5 km",value:5},{name:"10 km",value:10},{name:"100 km",value:100}];
  $scope.radioBusqueda = $scope.distancias[0];

  var markerCache = [];

  $scope.mapCreated = function (map) {
    $scope.map = map;

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function () {
      loadMarkers();

      //Reload markers every time the map moves
      google.maps.event.addListener($scope.map, 'dragend', function () {
        console.log("moved!");
        loadMarkers();
      });

      //Reload markers every time the zoom changes
      google.maps.event.addListener($scope.map, 'zoom_changed', function () {
        console.log("zoomed!");
        loadMarkers();
      });

      enableMap();

    });
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

    var onSuccess = function (position) {
      console.log('Got pos', position);

      $scope.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      $ionicLoading.hide()
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
      alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);


  };


  function loadMarkers() {

    var center = $scope.map.getCenter();
    var bounds = $scope.map.getBounds();
    var zoom = $scope.map.getZoom();

    //Convert objects returned by Google to be more readable
    var centerNorm = {
      lat: center.lat(),
      lng: center.lng()
    };

    var boundsNorm = {
      northeast: {
        lat: bounds.getNorthEast().lat(),
        lng: bounds.getNorthEast().lng()
      },
      southwest: {
        lat: bounds.getSouthWest().lat(),
        lng: bounds.getSouthWest().lng()
      }
    };

    var boundingRadius = getBoundingRadius(centerNorm, boundsNorm);

    var params = {
      "centre": centerNorm,
      "bounds": boundsNorm,
      "zoom": zoom,
      "boundingRadius": boundingRadius
    };

    var markers = prestadoresService.getPrestadoresAllAsync().then(function (markers) {
      console.log("Markers: ", markers);
      var records = markers;

      for (var i = 0; i < records.length; i++) {

        var record = records[i];

        // Check if the marker has already been added
        if (!markerExists(record.getCoordenadas().latitud, record.getCoordenadas().longitud)) {

          var markerPos = new google.maps.LatLng(record.getCoordenadas().longitud, record.getCoordenadas().latitud);
          // add the marker
          var marker = $scope.crearMarker(record);

          // Add the marker to the markerCache so we know not to add it again later
          var markerData = {
            lat: record.lat,
            lng: record.lng,
            marker: marker
          };

          markerCache.push(markerData);

          addInfoWindow(marker, record);

        }

      }

    });
  };

  function toRad(x) {
    return x * Math.PI / 180;
  }

  function addInfoWindow(marker, record) {

    var infoWindowContent = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<b>' + record.getNombre() + '</b>' +
      '<div id="bodyContent">' +
      '<p> ' + record.getDireccion() +
      '</p>' +
      '<a href="#detallePrestador">(Click para ver detalles) </a>' +
      '</div>' +
      '</div>';

    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    google.maps.event.addListener(marker, 'click', function () {
      busquedaActual.seleccionarPrestador(record);

      infoWindow.open($scope.map, marker);
    });

    marker.addListener('click', function () {
      busquedaActual.seleccionarPrestador(record);
      infoWindow.open($scope.map, marker);
    });
  };

  function getBoundingRadius(center, bounds) {
    return getDistanceBetweenPoints(center, bounds.northeast, 'miles');
  }

  function enableMap() {
    $ionicLoading.hide();
  }

  function getDistanceBetweenPoints(pos1, pos2, units) {

    var earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    var R = earthRadius[units || 'miles'];
    var lat1 = pos1.lat;
    var lon1 = pos1.lng;
    var lat2 = pos2.lat;
    var lon2 = pos2.lng;

    var dLat = toRad((lat2 - lat1));
    var dLon = toRad((lon2 - lon1));
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d;

  }

  function markerExists(lat, lng) {
    var exists = false;
    var cache = markerCache;
    for (var i = 0; i < cache.length; i++) {
      if (cache[i].lat === lat && cache[i].lng === lng) {
        exists = true;
      }
    }

    return exists;
  }

  $scope.crearMarker = function (record) {
    var myLatLng = {lat: record.getCoordenadas().latitud, lng: record.getCoordenadas().longitud};

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: $scope.map,
      title: record.getNombre()
    });

    return marker;
  };
});
