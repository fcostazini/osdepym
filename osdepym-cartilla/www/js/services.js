var services = angular.module('services', ['setup', 'data']);

services.factory('afiliadosService', function($http, $q, dataProvider, configuration) {
  var async = $q;

  return {
    loguearAfiliadoAsync: function(dni, sexo) {
       var deferred = async.defer();

       $http.get(configuration.serviceUrls.getAfiliado.replace('<dni>', dni).replace('<sexo>', sexo))
          .then(function(response) {

              if(response.data && response.data.afiliadoTO) {
                dataProvider
                  .addAfiliadoAsync(response.data.afiliadoTO)
                  .then(function onSuccess(success) {
                    if(success) {
                      deferred.resolve(new cartilla.model.Afiliado(response.data.afiliadoTO));
                    } else {
                      deferred.resolve(null);
                    }
                  }, function onError(error) {
                    deferred.reject(new cartilla.exceptions.ServiceException('Error al guardar el afiliado', error));
                  });
              } else {
                deferred.reject(new cartilla.exceptions.ServiceException('No existe un afiliado con DNI ' + dni));
              }
          }, function(error) {
              //TODO: Solo para hacer pruebas desde el browser respondo con un objeto harcode.
              // deferred.reject(new cartilla.exceptions.ServiceException(error));
              var afiliadoMock = new cartilla.model.Afiliado({ nombre: 'Afiliado prueba 1', dni: 31372955, cuil: 20313729550, sexo: 'M', plan: 'Plata' });
              dataProvider.addAfiliadoAsync(afiliadoMock.getObject())
                          .then(function onSuccess(success) {
                            if(success) {
                              deferred.resolve(afiliadoMock);
                            } else {
                              deferred.resolve(null);
                            }
                          }, function onError(error) {
                            deferred.reject(new cartilla.exceptions.ServiceException('Error al guardar el afiliado', error));
                          });

          });

       return deferred.promise;
    },
    getAfiliadoLogueadoAsync: function(){
      return dataProvider.getAfiliadoAsync();
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

services.factory('prestadoresService', function($q, dataProvider, configuration) {
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

           if(prestadores[i].getEspecialidad().toLowerCase() === especialidad.toLowerCase()) {
             if(zona && zona != '' && prestadores[i].getZona().toLowerCase() !== zona.toLowerCase()) {
               valid = false;
             }

             if(valid && localidad && localidad != '' && prestadores[i].getLocalidad().toLowerCase() !== localidad.toLowerCase()) {
               valid = false;
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
           if(prestadores[i].getNombre().toLowerCase() === nombre.toLowerCase()) {
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
             if(prestadores[i].getEspecialidad().toLowerCase() === especialidad.toLowerCase()
              && isInZone(prestadores[i], coordinates)) {
               result.push(prestadores[i]);
             }
          }

          deferred.resolve(result);
       }, function onError (error) {
         handle(error, deferred);
       });

     return deferred.promise;
   },
   getAllPrestadoresAsync: function() {
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

services.factory('actualizacionService', function($q, $http, dataProvider, configuration) {
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

              dataProvider
                .actualizarCartillaAsync(response.data)
                .then(function onSuccess(result) {
                    deferred.resolve(result);
                  }, function onError(error) {
                    handle(error, deferred);
                  });
         }, function onError(error) {
            //TODO: Solo para hacer pruebas desde el browser respondo con un objeto harcode.
            //handle(error, deferred);
            var prestadoresMock = [{"prestadorTO": {"calle": "A MARIA SAENZ","codigoPostal": 1832,"departamento": "","especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC","idBaseDeDatos": 0,"latitud": -34.757958,"localidad": "LOMAS DE ZAMORA","longitud": -58.401291,"nombre": ".CEPRESALUD","numeroCalle": 355,"piso": "","telefonos": "(  54)( 011)  42445891","zona": "GBA SUR"}},
                                   {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC","idBaseDeDatos": 1,"latitud": "-34.595140","localidad": "RECOLETA","longitud": -58.409447,"nombre": ".CEPRESALUD","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
                                   {"prestadorTO": {"calle": "ALMAFUERTE","codigoPostal": 1754,"departamento": "","especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC","idBaseDeDatos": 2,"latitud": -34.681472,"localidad": "SAN JUSTO","longitud": -58.555087,"nombre": ".CEPRESALUD","numeroCalle": 3545,"piso": "","telefonos": "(  54)( 011)  44821472", "zona": "GBA OESTE"}}
                                   ]


            dataProvider.actualizarCartillaAsync(prestadoresMock)
                                  .then(function onSuccess(result) {
                                      deferred.resolve(result);
                                    }, function onError(error) {
                                      handle(error, deferred);
                                    });
         });

      return deferred.promise;
    }
  };
});

