var services = angular.module('services', ['setup', 'data']);

services.factory('serviceContext', ['DataProvider', 'configuration', function(DataProvider, configuration) {
  return {
    dataProvider: new DataProvider(),
    configuration: configuration
  };
}]);

services.factory('afiliadosService', ['serviceContext', function(serviceContext) {
  return {
    hasAfiliado: function(dni) {
      var afiliados = serviceContext.dataProvider.getAfiliados();
      var max;

      for(var i = 0; max = afiliados.length; i += 1) {
        if(afiliados[i].getDNI() === dni) {
          return true;
        }
      }

      return false;
    }
  };
}]);

services.factory('filtrosService', ['serviceContext', function(serviceContext) {
  return {
    getEspecialidades: function() {
      return serviceContext.dataProvider.getEspecialidades();
    },
    getProvincias: function() {
     return serviceContext.dataProvider.getProvincias();
    },
    getLocalidades: function() {
      return serviceContext.dataProvider.getLocalidades();
    }
  };
}]);

services.factory('prestadoresService', ['serviceContext', function(serviceContext) {
  var isInZone = function(prestador, coordinates) {
    var radium = serviceContext.configuration.searchRadiumInMeters;
    //TODO: Code this method base on current coordinates and radium
  };

  return {
    getPrestadoresByEspecialidad: function(especialidad, provincia, localidad) {
     var prestadores = serviceContext.dataProvider.getPrestadores();
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
     var prestadores = serviceContext.dataProvider.getPrestadores();
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
     var prestadores = serviceContext.dataProvider.getPrestadores();
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
}]);

services.factory('busquedaActual', function() {
  var prestadores = [];
  var prestadorActual;

  return {
    getPrestadores: function() {
      return prestadores;
    },
    setPrestadores: function(prestadores) {
      this.prestadores = prestadores;
    },
    seleccionarPrestador: function(prestador) {
      this.prestadorActual = prestador;
    },
    getPrestadorActual: function() {
      return this.prestadorActual;
    }
  };
});

