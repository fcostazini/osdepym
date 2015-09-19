var services = angular.module('services', ['setup', 'data']);

services.factory('afiliadosService', function(dataProvider, configuration) {
  return {
    //TODO: We need to change this method to call rest service and also search in DB
    hasAfiliado: function(dni) {
      var afiliados = dataProvider.getAfiliados();
      var max;

      for(var i = 0; max = afiliados.length; i += 1) {
        if(afiliados[i].getDNI() === dni) {
          return true;
        }
      }

      return false;
    }
  };
});

services.factory('filtrosService', function(dataProvider, configuration) {
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
     var max;
     var result = [];

     for(var i = 0; max = prestadores.length; i += 1) {
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
     var max;
     var result = [];

     for(var i = 0; max = prestadores.length; i += 1) {
       if(prestadores[i].getNombre() === nombre) {
         result.push(prestadores[i]);
       }
     }

     return result;
   },
   getPrestadoresByCercania: function(especialidad, coordinates) {
     var prestadores = dataProvider.getPrestadores();
     var max;
     var result = [];

     for(var i = 0; max = prestadores.length; i += 1) {
       if(prestadores[i].getEspecialidad() === especialidad && isInZone(prestadores[i], coordinates)) {
         result.push(prestadores[i]);
       }
     }

     return result;
   }
  };
});

services.factory('httpService', function($http, configuration) {
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

