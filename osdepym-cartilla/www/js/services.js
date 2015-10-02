var services = angular.module('services', ['setup', 'data']);

services.factory('afiliadosService', function(dataProvider, configuration, $http, $q) {
  var async = $q;

  return {
    getAfiliadoLogueadoAsync: function(){
      return dataProvider.getAfiliadoAsync();
    },
    getAfiliadoAsync: function(dni, sexo) {
       var deferred = async.defer();

       $http.get(configuration.serviceUrls.getAfiliado.replace('<dni>', dni).replace('<sexo>', sexo))
          .then(function(response) {
              if(response.data && response.data.afiliadoTO) {
                deferred.resolve(new cartilla.model.Afiliado(response.data.afiliadoTO));
              } else {
                deferred.reject(new cartilla.exceptions.ServiceException('No existe un afiliado con DNI ' + dni));
              }
          }, function(error) {
             deferred.reject(new cartilla.exceptions.ServiceException(error));
          });

       return deferred.promise;
    },
    loguearAfiliadoAsync: function (afiliado) {
      return dataProvider.addAfiliadoAsync(afiliado);
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
    getPrestadoresByEspecialidadAsync: function(especialidad, zona, localidad) {
     var deferred = async.defer();

     dataProvider
      .getPrestadoresAsync()
      .then(function onSuccess(prestadores) {
         var result = [];

         for(var i = 0; i < prestadores.length; i ++) {
           var valid = true;

           if(prestadores[i].getEspecialidad().contains(especialidad)) {
             if(zona && prestadores[i].getZona() !== zona) {
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
   },
   getPrestadoresAllAsync: function() {
        var deferred = async.defer();

         dataProvider.getPrestadoresAsync()
          .then(function onSuccess(prestadores) {
             deferred.resolve(prestadores);
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

