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
                  .then(function (success) {
                    if(success) {
                      deferred.resolve(new cartilla.model.Afiliado(response.data.afiliadoTO));
                    } else {
                      deferred.resolve(null);
                    }
                  }, function (error) {
                    deferred.reject(new cartilla.exceptions.ServiceException('Error al guardar el afiliado', error));
                  });
              } else {
                deferred.reject(new cartilla.exceptions.ServiceException('No existe un afiliado con DNI ' + dni));
              }
          }, function(error) {
              //TODO: Solo para hacer pruebas desde el browser respondo con un objeto harcode.
              //deferred.reject(new cartilla.exceptions.ServiceException('Ocurrio un error al buscar el afiliado', error));
              var afiliadoMock = { nombre: 'Afiliado prueba 1', dni: 31372955, cuil: 20313729550, sexo: 'M', plan: 'Plata' };

              dataProvider.addAfiliadoAsync(afiliadoMock)
                  .then(function (success) {
                    if(success) {
                      deferred.resolve(new cartilla.model.Afiliado(afiliadoMock));
                    } else {
                      deferred.resolve(null);
                    }
                  }, function (error) {
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

  return {
    getAllPrestadoresAsync: function() {
      var deferred = async.defer();

      dataProvider.getPrestadoresAsync()
      .then(function (prestadores) {
         deferred.resolve(prestadores);
      }, function (error) {
        deferred.reject(new cartilla.exceptions.ServiceException('Ocurrio un error al obtener prestadores', error));
      });

      return deferred.promise;
    },
    getPrestadoresByEspecialidadAsync: function(especialidad, zona, localidad) {
     var deferred = async.defer();

     var criteria = { especialidad : especialidad };

     if(zona && zona !== '') {
      criteria['zona'] = zona;

      if(localidad && localidad !== '') {
        criteria['localidad'] = localidad;
      }
     }

     dataProvider
      .getPrestadoresByAsync(criteria)
      .then(function (prestadores) {
         deferred.resolve(prestadores);
      }, function (error) {
        deferred.reject(new cartilla.exceptions.ServiceException('Ocurrio un error al obtener prestadores', error));
      });

     return deferred.promise;
   },
   getPrestadoresByNombreAsync: function(nombre) {
     var deferred = async.defer();

     dataProvider.getPrestadoresByAsync({ nombre : nombre })
      .then(function (prestadores) {
         deferred.resolve(prestadores);
      }, function (error) {
        deferred.reject(new cartilla.exceptions.ServiceException('Ocurrio un error al obtener prestadores', error));
      });

    return deferred.promise;
   },
   getPrestadoresByCercaniaAsync: function(especialidad, coordinates) {
     var deferred = async.defer();

      dataProvider.getPrestadoresByAsync({ especialidad : especialidad })
       .then(function (prestadores) {
          var result = [];

          for(var i = 0; i < prestadores.length; i ++) {
             if(isInZone(prestadores[i], coordinates)) {
               result.push(prestadores[i]);
             }
          }

          deferred.resolve(result);
       }, function (error) {
         deferred.reject(new cartilla.exceptions.ServiceException('Ocurrio un error al obtener prestadores', error));
       });

     return deferred.promise;
   }
  };
});

services.factory('actualizacionService', function($q, $http, dataProvider, configuration) {
  var async = $q;

  return {
    actualizarCartillaAsync: function(dni, sexo) {
      var deferred = async.defer();

      $http.get(configuration.serviceUrls.getPrestadores.replace('<dni>', dni).replace('<sexo>', sexo))
         .then(function (response) {
              dataProvider
                .actualizarCartillaAsync(response.data)
                .then(function (result) {
                    deferred.resolve(result);
                  }, function (error) {
                    deferred.reject(new cartilla.exceptions.ServiceException('Ocurrio un error al actualizar la cartilla', error));
                  });
         }, function (error) {
            //TODO: Solo para hacer pruebas desde el browser respondo con un objeto harcode.
            //deferred.reject(new cartilla.exceptions.ServiceException('Ocurrio un error al actualizar la cartilla', error));
            var prestadoresMock = [
              {"prestadorTO": {"calle": "A MARIA SAENZ","codigoPostal": 1832,"departamento": "","especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC","idBaseDeDatos": 0,"latitud": -34.757958,"localidad": "LOMAS DE ZAMORA","longitud": -58.401291,"nombre": ".CEPRESALUD","numeroCalle": 355,"piso": "","telefonos": "(  54)( 011)  42445891","zona": "GBA SUR"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC","idBaseDeDatos": 1,"latitud": "-34.595140","localidad": "RECOLETA","longitud": -58.409447,"nombre": ".CEPRESALUD","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 1,"latitud": "-34.595150","localidad": "RECOLETA","longitud": -58.409447,"nombre": ".CEPRESALUD1","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 2,"latitud": "-34.595140","localidad": "RECOLETA","longitud": -58.409446,"nombre": ".CEPRESALUD2","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 3,"localidad": "RECONTRALETA","nombre": ".CEPRESALUD3","numeroCalle": 1238,"piso": "Piso PB","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 4,"latitud": "-36.595110","localidad": "RECOLETA","longitud": -58.409445,"nombre": ".CEPRESALUD4","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 5,"latitud": "-37.595140","localidad": "RECOLETA","longitud": -58.409442,"nombre": ".CEPRESALUD5","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 6,"latitud": "-38.595120","localidad": "RECOLETA","longitud": -58.409441,"nombre": ".CEPRESALUD6","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 7,"latitud": "-39.595140","localidad": "RECOLETA","longitud": -58.409440,"nombre": ".CEPRESALUD7","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 8,"latitud": "-30.595130","localidad": "RECOLETA","longitud": -58.409445,"nombre": ".CEPRESALUD8","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 9,"latitud": "-34.565040","localidad": "RECOLETA","longitud": -58.409447,"nombre": ".CEPRESALUD9","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 0,"latitud": "-34.577240","localidad": "RECOLETA","longitud": -58.409442,"nombre": ".CEPRESALUD0","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 10,"latitud": "-34.512130","localidad": "RECOLETA","longitud": -58.409441,"nombre": ".CEPRESALUD10","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 11,"latitud": "-34.523120","localidad": "RECOLETA","longitud": -58.409442,"nombre": ".CEPRESALUD11","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 12,"latitud": "-34.541141","localidad": "RECOLETA","longitud": -58.409443,"nombre": ".CEPRESALUD12","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 13,"latitud": "-50.511142","localidad": "RECOLETA","longitud": -58.409445,"nombre": ".CEPRESALUD13","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 14,"latitud": "-34.501143","localidad": "RECOLETA","longitud": -58.409440,"nombre": ".CEPRESALUD14","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 15,"latitud": "-100.592144","localidad": "RECOLETA","longitud": -58.409449,"nombre": ".CEPRESALUD15","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "AGUERO","codigoPostal": 1425,"departamento": "Dpto. 2","especialidad": "CARDIOLOGÍA","idBaseDeDatos": 16,"latitud": "-34.597145","localidad": "RECOLETA","longitud": -58.409448,"nombre": ".CEPRESALUD16","numeroCalle": 1238,"piso": "Piso PB","telefonos": "(  54)( 011)  49620541","zona": "CAPITAL FEDERAL"}},
              {"prestadorTO": {"calle": "ALMAFUERTE","codigoPostal": 1754,"departamento": "","especialidad": "LABORATORIO DE ANÁLISIS CLÍNIC","idBaseDeDatos": 2,"latitud": -34.681472,"localidad": "SAN JUSTO","longitud": -58.555087,"nombre": ".CEPRESALUD","numeroCalle": 3545,"piso": "","telefonos": "(  54)( 011)  44821472", "zona": "GBA OESTE"}}
            ];

            dataProvider.actualizarCartillaAsync(prestadoresMock)
              .then(function (result) {
                  deferred.resolve(result);
                }, function (error) {
                  handle(error, deferred);
                });
         });

      return deferred.promise;
    }
  };
});

