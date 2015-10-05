var controllers = angular.module('controllers', ['services', 'model', 'exceptions']);

controllers.controller('NavigationController', function ($ionicSideMenuDelegate, $ionicHistory, $location, $state, $timeout, actualizacionService, errorHandler, contextoActual, $ionicLoading) {
  var viewModel = this;

  var afiliadoLogueado = contextoActual.getAfiliadoLogueado();

  viewModel.back = function () {
    if ($state.current.name == "cartilla") {
      $location.path("home");
    } else {
      $ionicHistory.goBack();
    }
  };

  viewModel.menu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };

  viewModel.actualizar = function () {
    $ionicLoading.show({
                        content: 'Actualizando Cartilla',
                        showBackdrop: false
                      });

    if (afiliadoLogueado) {
      actualizacionService.actualizarCartillaAsync(afiliadoLogueado.getDNI(), afiliadoLogueado.getSexo())
        .then(function onSuccess(actualizada) {
          viewModel.cartillaActualizada = actualizada;
          $ionicLoading.hide();
        }, function onError(error) {
          var message = errorHandler.handle(error);
          $ionicLoading.hide();
          alert(message);
        });
    }
  };

  viewModel.goTo = function (view, delay) {
    $timeout(function () {
      $location.path(view);
    }, delay ? delay : 0);
  };

  viewModel.isRoot = function () {
    return $state.current.name != 'login' && $state.current.name != 'home';
  }
});

controllers.controller('LoginController', function ($ionicHistory, $location, $ionicLoading, actualizacionService, afiliadosService, errorHandler, contextoActual) {
  var viewModel = this;

  var goHome = function () {
    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $location.path("home");
  };

  viewModel.dni = '';
  viewModel.tel = '';
  viewModel.genero = '';


  viewModel.login = function () {
    $ionicLoading.show({
      content: 'Buscando Afiliado',
      showBackdrop: false
    });

    afiliadosService
      .loguearAfiliadoAsync(viewModel.dni, viewModel.genero)
      .then(function onSuccess(afiliadoLogueado) {
        if (afiliadoLogueado) {
          contextoActual.setAfiliadoLogueado(afiliadoLogueado);
          actualizacionService.actualizarCartillaAsync(afiliadoLogueado.getDNI(), afiliadoLogueado.getSexo())
            .then(function success() {
              $ionicLoading.hide();
              goHome();
            }, function error(error) {
              errorHandler.handle(error);
              $ionicLoading.hide();
            })

        } else {
          $ionicLoading.hide();
          alert("Ocurrió un error al loguear el afiliado");
        }
      }, function onError(error) {
        errorHandler.handle(error);
        $ionicLoading.hide();
      });
  };
});

controllers.controller('EspecialidadSearchController', function ($location, opcionesService, prestadoresService, errorHandler, contextoActual) {
  var viewModel = this;

  viewModel.isDisabled = true;

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
      errorHandler.handle(error, cartilla.constants.filtrosBusqueda.ESPECIALIDADES);
    });

  opcionesService
    .getProvinciasAsync()
    .then(function onSuccess(provincias) {
      viewModel.provincias = provincias;
    }, function onError(error) {
      errorHandler.handle(error, cartilla.constants.filtrosBusqueda.PROVINCIAS);
    });

  opcionesService
    .getLocalidadesAsync()
    .then(function onSuccess(localidades) {
      viewModel.localidades = localidades;
    }, function onError(error) {
      errorHandler.handle(error, cartilla.constants.filtrosBusqueda.LOCALIDADES);
    });

  viewModel.searchByEspecialidad = function () {
    prestadoresService
      .getPrestadoresByEspecialidadAsync(viewModel.especialidadSeleccionada, viewModel.provinciaSeleccionada, viewModel.localidadSeleccionada)
      .then(function onSuccess(prestadores) {
        contextoActual.setPrestadores(prestadores);
        contextoActual.setTipoBusqueda(cartilla.constants.tiposBusqueda.ESPECIALIDAD);
        $location.path("resultados");
      }, function onError(error) {
        errorHandler.handle(error, cartilla.constants.filtrosBusqueda.PRESTADORES);
      });
  };
  setTimeout(function () {
    viewModel.isDisabled = false
  }, 200);
});

controllers.controller('NombreSearchController', function ($location, prestadoresService, errorHandler, contextoActual) {
  var viewModel = this;

  viewModel.nombre = '';

  viewModel.searchByNombre = function () {
    prestadoresService.getPrestadoresByNombreAsync(viewModel.nombre)
      .then(function onSuccess(prestadores) {
        contextoActual.setPrestadores(prestadores);
        contextoActual.setTipoBusqueda(cartilla.constants.tiposBusqueda.NOMBRE);
        $location.path("resultados");
      }, function onError(error) {
        errorHandler.handle(error, cartilla.constants.filtrosBusqueda.PRESTADORES);
      });
  };
});

controllers.controller('CercaniaSearchController', function ($location, opcionesService, prestadoresService, errorHandler, contextoActual) {
  var viewModel = this;

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
      errorHandler.handle(error, cartilla.constants.filtrosBusqueda.ESPECIALIDADES);
    });

  viewModel.searchByEspecialidad = function () {
    prestadoresService
      .getPrestadoresByEspecialidadAsync(viewModel.especialidadSeleccionada, '', '')
      .then(function onSuccess(prestadores) {
        contextoActual.setPrestadores(prestadores);
        contextoActual.setTipoBusqueda(cartilla.constants.tiposBusqueda.CERCANIA);
        $location.path("mapa");
      }, function onError(error) {
        errorHandler.handle(error, cartilla.constants.filtrosBusqueda.PRESTADORES);
      });
  };
});

controllers.controller('ResultadoBusquedaController', function ($location, contextoActual) {
  var viewModel = this;

  viewModel.contextoActual = contextoActual;
  viewModel.titulo = "RESULTADO POR " + contextoActual.getTipoBusqueda().toUpperCase();

  viewModel.seleccionarPrestador = function (prestador) {
    contextoActual.seleccionarPrestador(prestador);

    $location.path("detallePrestador");
  };
});

controllers.controller('DetallePrestadorController', function ($cordovaGeolocation, $ionicLoading, contextoActual) {
  var viewModel = this;

  viewModel.contextoActual = contextoActual;
  viewModel.titulo = "RESULTADO POR " + contextoActual.getTipoBusqueda().toUpperCase();
  viewModel.prestador = contextoActual.getPrestadorActual();

  viewModel.map = null;

  viewModel.collapseIcon = "ion-chevron-down";
  viewModel.isCollapsed = true;

  viewModel.getTelefonoContacto = function () {
    var strTel = viewModel.prestador.getTelefonos()[0];

    return strTel.trim().replace(/ /g, '').replace(/\(54\)/g, '').replace(/\(/g, '').replace(/\)/g, '')
  };

  viewModel.toggleCollapse = function () {
    if (viewModel.isCollapsed) {
      viewModel.collapseIcon = "ion-chevron-up";
    } else {
      viewModel.collapseIcon = "ion-chevron-down";
    }

    viewModel.isCollapsed = !this.isCollapsed;
  }

  viewModel.mapCreated = function (map) {
    viewModel.map = map;

    var myLatLng = {
      lat: contextoActual.getPrestadorActual().getCoordenadas().latitud,
      lng: contextoActual.getPrestadorActual().getCoordenadas().longitud
    };

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: viewModel.map,
      title: contextoActual.getPrestadorActual().getNombre()
    });

    viewModel.map.setCenter(new google.maps.LatLng(contextoActual.getPrestadorActual().getCoordenadas().latitud, contextoActual.getPrestadorActual().getCoordenadas().longitud));
  };
});

controllers.controller('MapCtrl', function (prestadoresService, contextoActual, $scope, $ionicLoading, $cordovaGeolocation) {
  $scope.map = null;
  $scope.distancias = [{name: "1 km", value: 1}, {name: "5 km", value: 5}, {name: "10 km", value: 10}, {
    name: "100 km",
    value: 100
  }];
  $scope.radioBusqueda = $scope.distancias[0];

  $scope.markerCache = [];

  $scope.mapCreated = function (map) {
    $scope.map = map;

    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function () {
      //loadMarkers();

      //Reload markers every time the map moves
      google.maps.event.addListener($scope.map, 'dragend', function () {
        console.log("moved!");
        //loadMarkers();
      });

      //Reload markers every time the zoom changes
      google.maps.event.addListener($scope.map, 'zoom_changed', function () {
        console.log("zoomed!");
        //loadMarkers();
      });

      $scope.loading = $ionicLoading.show({
        content: 'Getting current location...',
        showBackdrop: false
      });
      navigator.geolocation.getCurrentPosition(
        function onSuccess(position) {
          $scope.miPosicion = position;
          $scope.centerOnPos(position);
          $scope.updateMarkers(1);
          $ionicLoading.hide()
        }
        , function onError(error) {
          alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
        });

      $scope.updateMarkers = function (distancia) {
        $scope.markerCache = [];
        setMapOnAll($scope.map);

        var marker;
        for (var index in contextoActual.getPrestadores()) {
          var pos = {
            lat: contextoActual.getPrestadores()[index].getCoordenadas().latitud,
            lng: contextoActual.getPrestadores()[index].getCoordenadas().longitud
          };


          marker = new google.maps.Marker({
            position: pos,
            map: $scope.map,
            title: contextoActual.getPrestadores()[index].getNombre()
          });
        }
        ;
        $scope.markerCache.push(marker);
      }
      enableMap();

    });
  };
// Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 0; i < $scope.markerCache.length; i++) {
      $scope.markerCache[i].setMap(map);
    }
  }

  $scope.centerOnPos = function (pos) {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }
    var latLong = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    $scope.map.setCenter(latLong);
    new google.maps.Marker({
      position: latLong,
      map: $scope.map,
      icon: 'img/green-dot.png',
      title: "Mi Posición"
    });
    $ionicLoading.hide();

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


    var records = contextoActual.getPrestadores();

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
      contextoActual.seleccionarPrestador(record);

      infoWindow.open($scope.map, marker);
    });

    marker.addListener('click', function () {
      contextoActual.seleccionarPrestador(record);
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
