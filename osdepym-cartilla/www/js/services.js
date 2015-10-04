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
            deferred.reject(new cartilla.exceptions.ServiceException(error));
           // deferred.resolve(new cartilla.model.Afiliado({ nombre: 'Afiliado prueba 1', dni: 31372955, cuil: 20313729550, sexo: 'M', plan: 'Plata' }));
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

services.factory('actualizacionService', function($q, dataProvider, configuration,$http) {
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
            deferred.resolve([
               new cartilla.model.Prestador({id: 1, nombre: 'Mauro Agnoletti', especialidad: 'LABORATORIO DE ANÁLISIS CLÍNICO', calle: 'AGUERO', numeroCalle: 1425, piso: 1, departamento: 'A', localidad: 'RECOLETA', zona: 'CAPITAL FEDERAL', codigoPostal: 555, latitud: -34.595140, longitud: -58.409447, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
               new cartilla.model.Prestador({id: 2, nombre: 'Facundo Costa Zini', especialidad: 'Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
               new cartilla.model.Prestador({id: 3, nombre: 'Dario Camarro', especialidad: 'LABORATORIO DE ANÁLISIS CLÍNICO', calle: 'AV B RIVADAVIA', numeroCalle: 1424, piso: 8, departamento: '', localidad: 'CABALLITO', zona: 'CAPITAL FEDERAL', codigoPostal: 5170, latitud: -34.619247, longitud: -58.438518, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
               new cartilla.model.Prestador({id: 4, nombre: 'Facundo Costa Zini', especialidad: 'Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
               new cartilla.model.Prestador({id: 5, nombre: 'Facundo Costa Zini', especialidad: 'Odontología, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontología, OdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontología, OdontologíaOdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontologíaOdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'})
             ]);
         });

      return deferred.promise;
    }
  };
});

