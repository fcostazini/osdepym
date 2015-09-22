var controllers = angular.module('controllers', ['services', 'model']);

//TODO: Remove this and use AfiliadosController
controllers.controller('TestController', function(opcionesService, testService, $log) {
    var viewModel = this;

    viewModel.nombre = 'Antes';
    viewModel.especialidades = [];

    opcionesService
      .getEspecialidadesAsync()
      .then(function onSuccess(especialidades) {
        viewModel.especialidades = especialidades;
      }, function onError(error) {
        var message = '';

        if(error instanceof cartilla.exceptions.ServiceException) {
          message = error.getMessage();

          if(error.getInnerException()) {
            message += ' - ' + error.getInnerException().getMessage();
          }
        } else {
          message = 'Ocurrió un error inesperado al buscar especialidades';
        }

        $log.error(message);
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

controllers.controller('AfiliadosController', function(afiliadosService, actualizacionService, $log) {
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
          var message = '';

          if(error instanceof cartilla.exceptions.ServiceException) {
            message = error.getMessage();

            if(error.getInnerException()) {
              message += ' - ' + error.getInnerException().getMessage();
            }
          } else {
            message = 'Ocurrió un error inesperado al buscar afiliados';
          }

          $log.error(message);
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

controllers.controller('EspecialidadSearchController', function(opcionesService, prestadoresService, busquedaActual, $log) {
    var viewModel = this;

    var handle = function(error, descriptionBusqueda) {
      var message = '';

      if(error instanceof cartilla.exceptions.ServiceException) {
        message = error.getMessage();

        if(error.getInnerException()) {
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

        if(especialidades && especialidades[0]) {
          viewModel.especialidadSeleccionada = especialidades[0].getNombre();
        }
      }, function onError(error) {
        handle(error, 'especialidades');
      });

    opcionesService
      .getProvinciasAsync()
      .then(function onSuccess(provincias) {
        viewModel.provincias = provincias;
      }, function onError(error) {
        handle(error, 'provincias');
      });

    opcionesService
      .getLocalidadesAsync()
      .then(function onSuccess(localidades) {
        viewModel.localidades = localidades;
      }, function onError(error) {
        handle(error, 'localidades');
      });

    viewModel.searchByEspecialidad = function() {
      prestadoresService
        .getPrestadoresByEspecialidadAsync(viewModel.especialidadSeleccionada, viewModel.provinciaSeleccionada, viewModel.localidadSeleccionada)
        .then(function onSuccess(prestadores) {
          busquedaActual.setPrestadores(prestadores);
        }, function onError(error) {
          handle(error, 'prestadores');
        });
    };
});

controllers.controller('NombreSearchController', function(prestadoresService, busquedaActual, $log) {
    var viewModel = this;

    viewModel.nombre = '';

    viewModel.searchByNombre = function() {
      prestadoresService.getPrestadoresByNombreAsync(viewModel.nombre)
        .then(function onSuccess(prestadores) {
            busquedaActual.setPrestadores(prestadores);
          }, function onError(error) {
            var message = '';

            if(error instanceof cartilla.exceptions.ServiceException) {
              message = error.getMessage();

              if(error.getInnerException()) {
                message += ' - ' + error.getInnerException().getMessage();
              }
            } else {
              message = 'Ocurrió un error inesperado al buscar prestadores';
            }

            $log.error(message);
          });
    };
});

controllers.controller('CercaniaSearchController', function(opcionesService, prestadoresService, busquedaActual, $log) {
    var viewModel = this;

    var handle = function(error, descriptionBusqueda) {
      var message = '';

      if(error instanceof cartilla.exceptions.ServiceException) {
        message = error.getMessage();

        if(error.getInnerException()) {
          message += ' - ' + error.getInnerException().getMessage();
        }
      } else {
        message = 'Ocurrió un error inesperado al buscar ' + descriptionBusqueda;
      }

      $log.error(message);
    };

    viewModel.especialidades = [];

    opcionesService
      .getEspecialidadesAsync()
      .then(function onSuccess(especialidades) {
        viewModel.especialidades = especialidades;
      }, function onError(error) {
        handle(error, 'especialidades');
      });

    viewModel.especialidadSeleccionada = '';

    viewModel.searchByNombre = function() {
      //TODO: How to get current coordinates?
      var currentCoordinates = '';

      opcionesService.getPrestadoresByCercaniaAsync(viewModel.especialidadSeleccionada, currentCoordinates)
        .then(function onSuccess(prestadores) {
            busquedaActual.setPrestadores(prestadores);
          }, function onError(error) {
            handle(error, 'prestadores');
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

controllers.controller('MapCtrl', function($scope, $ionicLoading, markerService) {

  $scope.map  = null;
  var markerCache = [];

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.centerOnMe();
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
      loadMarkers();

      //Reload markers every time the map moves
      google.maps.event.addListener($scope.map, 'dragend', function(){
        console.log("moved!");
        loadMarkers();
      });

      //Reload markers every time the zoom changes
      google.maps.event.addListener($scope.map, 'zoom_changed', function(){
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

    navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $ionicLoading.hide()
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };

  function loadMarkers(){

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

      var markers = markerService.getMarkersAsync(params).then(function(markers){
        console.log("Markers: ", markers);
        var records = markers;

        for (var i = 0; i < records.length; i++) {

          var record = records[i];

          // Check if the marker has already been added
          if (!markerExists(record.lat, record.lng)) {

              var markerPos = new google.maps.LatLng(record.lng, record.lat);
              // add the marker
              var marker = $scope.crearMarker(record);

              // Add the marker to the markerCache so we know not to add it again later
              var markerData = {
                lat: record.lat,
                lng: record.lng,
                marker: marker
              };

              markerCache.push(markerData);

              var infoWindowContent = "<h4>" + record.name + "</h4>";

              addInfoWindow(marker, infoWindowContent, record);
          }

        }

      });
  };

  function toRad(x){
      return x * Math.PI / 180;
  }

  function addInfoWindow(marker, message, record) {

      var infoWindow = new google.maps.InfoWindow({
          content: message
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open(map, marker);
      });

  }
  function getBoundingRadius(center, bounds){
    return getDistanceBetweenPoints(center, bounds.northeast, 'miles');
  }

  function enableMap(){
    $ionicLoading.hide();
  }

  function getDistanceBetweenPoints(pos1, pos2, units){

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

  function markerExists(lat, lng){
    var exists = false;
    var cache = markerCache;
    for(var i = 0; i < cache.length; i++){
      if(cache[i].lat === lat && cache[i].lng === lng){
        exists = true;
      }
    }

    return exists;
    }

  $scope.crearMarker = function(record){
      var myLatLng = {lat: record.lat, lng: record.lng};

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
        return marker;
  };

  $scope.buscarPorCercania = function(){

  };
});
