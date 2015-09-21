var services = angular.module('services', ['setup', 'data']);

//TODO: We should remove this. The specific logic should be in each service (like getAfiliado in afiliadosService). The httpService is just $http
services.factory('testService', function(configuration, $http, $q) {
  var async = $q;

  return {
    getUsuarioAsync: function(dni, sexo) {
      var deferred = async.defer();

      $http.get(configuration.serviceUrls.getAfiliado.replace('<dni>', dni).replace('<sexo>', sexo))
         .then(function onSuccess (response) {
            deferred.resolve(response.data.afiliadoTO);
         }, function onError (error) {
            deferred.reject(error);
         });

       return deferred.promise;
    }
  };
});

services.factory('afiliadosService', function(dataProvider, configuration, $http, $q) {
  var async = $q;

  return {
    getAfiliadoAsync: function(dni, sexo) {
       var deferred = async.defer();

       $http.get(configuration.serviceUrls.getAfiliado.replace('<dni>', dni).replace('<sexo>', sexo))
          .then(function(response) {
              if(response.data && response.data.afiliadoTO) {
                deferred.resolve(new cartilla.model.Afiliado(response.data.afiliadoTO));
              }

              deferred.reject(new cartilla.exceptions.ServiceException('No existe un afiliado con DNI ' + dni));
          }, function(err) {
             deferred.reject(new cartilla.exceptions.ServiceException(error));
          });

       return deferred.promise;
    }
  };
});

services.factory('opcionesService', function(dataProvider, configuration) {
  return {
    getEspecialidadesAsync: function() {
      return dataProvider.getEspecialidadesAsync();
    },
    getProvinciasAsync: function() {
     return dataProvider.getProvinciasAsync();
    },
    getLocalidadesAsync: function() {
      return dataProvider.getLocalidadesAsync();
    }
  };
});

services.factory('prestadoresService', function(dataProvider, configuration, $q) {
  var async = $q;

  var isInZone = function(prestador, coordinates) {
    var radium = configuration.searchRadiumInMeters;
    //TODO: Code this method base on current coordinates and radium
  };

  var handle = function(error, deferred) {
    var message = 'Ocurrió un error al obtener prestadores';

    if(error instanceof cartilla.exceptions.DataException) {
      deferred.reject(new cartilla.exceptions.ServiceException(message, error));
    } else {
      message = message + ' - Detalle: ' + error;
      deferred.reject(new cartilla.exceptions.ServiceException(message));
    }
  };

  return {
    getPrestadoresByEspecialidadAsync: function(especialidad, provincia, localidad) {
     var deferred = async.defer();

     dataProvider
      .getPrestadoresAsync()
      .then(function onSuccess(prestadores) {
         var result = [];

         for(var i = 0; i < prestadores.length; i ++) {
           var valid = true;

           if(prestadores[i].getEspecialidad() === especialidad) {
             if(provincia && prestadores[i].getProvincia() !== provincia) {
               valid = false;
             }

             if(valid && localidad) {
               if(prestadores[i].getLocalidad() !== localidad) {
                 valid = false;
               }
             }
           } else {
             valid = false;
           }

           if(valid) {
             result.push(prestadores[i]);
           }
         }

         deferred.resolve(result);
      }, function onError(error) {
        handle(error, deferred);
      });

     return deferred.promise;
   },
   getPrestadoresByNombreAsync: function(nombre) {
     var deferred = async.defer();

     dataProvider.getPrestadoresAsync()
      .then(function onSuccess(prestadores) {
         var result = [];

         for(var i = 0; i < prestadores.length; i ++) {
           if(prestadores[i].getNombre() === nombre) {
             result.push(prestadores[i]);
           }
         }

         deferred.resolve(result);
      }, function onError (error) {
        handle(error, deferred);
      });

    return deferred.promise;
   },
   getPrestadoresByCercaniaAsync: function(especialidad, coordinates) {
     var deferred = async.defer();

      dataProvider.getPrestadoresAsync()
       .then(function onSuccess(prestadores) {
          var result = [];

          for(var i = 0; i < prestadores.length; i ++) {
             if(prestadores[i].getEspecialidad() === especialidad && isInZone(prestadores[i], coordinates)) {
               result.push(prestadores[i]);
             }
          }

          deferred.resolve(result);
       }, function onError (error) {
         handle(error, deferred);
       });

     return deferred.promise;
   }
  };
});

services.factory('actualizacionService', function(dataProvider, configuration, $q) {
  var async = $q;

  var handle = function(error, deferred) {
    var message = 'Ocurrió un error al actualizar la cartilla';

    if(error instanceof cartilla.exceptions.DataException) {
      deferred.reject(new cartilla.exceptions.ServiceException(message, error));
    } else {
      message = message + ' - Detalle: ' + error;
      deferred.reject(new cartilla.exceptions.ServiceException(message));
    }
  };

  return {
    actualizarCartillaAsync: function(dni, sexo) {
      var deferred = async.defer();

      $http.get(configuration.serviceUrls.getPrestadores.replace('<dni>', dni).replace('<sexo>', sexo))
         .then(function onSuccess(response) {
              dataProvider.updateDataAsync(response.data)
                .then(function onSuccess(result) {
                    deferred.resolve(result);
                  }, function onError(error) {
                    handle(error, deferred);
                  });
         }, function onError(error) {
            handle(error, deferred);
         });

      return deferred.promise;
    }
  };
});

services.factory('markerService', function(dataProvider, configuration) {
  return {
    getMarkersAsync: function(params) {
      return dataProvider.getMarkersAsync();
    }
  };
});
