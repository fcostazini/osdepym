var services = angular.module('services', ['setup', 'data']);

services.factory('afiliadosService', function(dataProvider, configuration, $http) {
  return {
    getAfiliado: function(dni, sexo) {
       return $http.get(configuration.serviceUrls.getAfiliado.replace('<dni>', dni).replace('<sexo>', sexo))
          .then(function(response) {
              if(response.data && response.data.afiliadoTO) {
                return new cartilla.model.Afiliado(response.data.afiliadoTO);
              }

              return null;
          }, function(err) {
             //TODO: Error handling
             return null;
          });
    }
  };
});

services.factory('opcionesService', function(dataProvider, configuration) {
  return {
    getEspecialidades: function() {
      return dataProvider.getEspecialidades();
    },
    getProvincias: function() {
     return dataProvider.getProvincias();
    },
    getLocalidades: function() {
      return dataProvider.getLocalidades();
    }
  };
});

services.factory('prestadoresService', function(dataProvider, configuration) {
  var isInZone = function(prestador, coordinates) {
    var radium = configuration.searchRadiumInMeters;
    //TODO: Code this method base on current coordinates and radium
  };

  return {
    getPrestadoresByEspecialidad: function(especialidad, provincia, localidad) {
     var prestadores = dataProvider.getPrestadores();
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

     return result;
   },
   getPrestadoresByNombre: function(nombre) {
     var prestadores = dataProvider.getPrestadores();
     var result = [];

     for(var i = 0; i < prestadores.length; i ++) {
       if(prestadores[i].getNombre() === nombre) {
         result.push(prestadores[i]);
       }
     }

     return result;
   },
   getPrestadoresByCercania: function(especialidad, coordinates) {
     var prestadores = dataProvider.getPrestadores();
     var result = [];

     for(var i = 0; i < prestadores.length; i ++) {
       if(prestadores[i].getEspecialidad() === especialidad && isInZone(prestadores[i], coordinates)) {
         result.push(prestadores[i]);
       }
     }

     return result;
   }
  };
});

services.factory('actualizacionService', function(dataProvider, configuration) {
  return {
    actualizarCartilla: function(dni, sexo) {
      $http.get(configuration.serviceUrls.getPrestadores.replace('<dni>', dni).replace('<sexo>', sexo))
         .then(function(response) {
              dataProvider.updateData(response.data);
         }, function(err) {
            //TODO: Error handling
         });
    }
  };
});

//TODO: We should remove this. The specific logic should be in each service (like getAfiliado in afiliadosService). The httpService is just $http
services.factory('testService', function($http, configuration) {
  return {
    getUsuario: function(dni, sexo, actualizarCallback) {
      $http.get(configuration.serviceUrls.getAfiliado.replace('<dni>', dni).replace('<sexo>', sexo))
         .then(function(resp) {
              actualizarCallback(resp.data.afiliadoTO.nombre);
         }, function(err) {
			      //TODO: Replace this with logging or throw an exception. Alert should not be used on non UI contexts (like an HTML page)
            alert(JSON.stringify(err));
         });
    }
  };
});

