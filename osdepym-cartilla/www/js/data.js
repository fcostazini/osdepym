var data = angular.module('data', ['setup', 'ngCordova']);

data.factory('dataProvider', function($cordovaSQLite, $q, configuration) {
  var dataProvider;

  if(configuration.useDataBase) {
    var dataBase = new cartilla.data.SQLiteDataBase($cordovaSQLite, $q, configuration);

    dataProvider = new cartilla.data.DataBaseDataProvider($q, dataBase);
  } else {
    dataProvider = new cartilla.data.StaticDataProvider($q);
  }

  return dataProvider;
});

cartilla.namespace('cartilla.data.SQLiteDataBase');

cartilla.data.SQLiteDataBase = (function() {
  var sqlite;
  var async;
  var db;

  var constructor = function($sqlite, $q, configuration) {
    sqlite = $sqlite;
    async = $q;

    if (window.cordova && window.SQLitePlugin) {
      db = sqlite.openDB({ name: configuration.dbName, bgType: 1 });
    } else {
      db = window.openDatabase(configuration.dbName, '1.0', configuration.dbName, 100 * 1024 * 1024);
    }

    if(configuration.reCreateDataBase) {
      drop(cartilla.model.Afiliado.getMetadata());
      drop(cartilla.model.Especialidad.getMetadata());
      drop(cartilla.model.Localidad.getMetadata());
      drop(cartilla.model.Provincia.getMetadata());
      drop(cartilla.model.Prestador.getMetadata());
    }

    initialize(cartilla.model.Afiliado.getMetadata());
    initialize(cartilla.model.Especialidad.getMetadata());
    initialize(cartilla.model.Localidad.getMetadata());
    initialize(cartilla.model.Provincia.getMetadata());
    initialize(cartilla.model.Prestador.getMetadata());
  };

  var drop = function(metadata) {
    var script = 'DROP TABLE ' + metadata.name;

    sqlite.execute(db, script);
  };

  var initialize = function(metadata) {
    var script = 'CREATE TABLE IF NOT EXISTS ';

    script += metadata.name + ' (';

    for(var i = 0; i < metadata.attributes.length; i ++) {
      var description = metadata.attributes[i].name + ' ' + metadata.attributes[i].type;

      script += i == metadata.attributes.length - 1 ? description + ')' : description + ', ';
    }

    sqlite.execute(db, script);
  };

  var queryAsync = function (script, parameters) {
    var params = parameters || [];
    var deferred = async.defer();

    sqlite.execute(db, script, parameters)
      .then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  var isValidObject = function(metadata, object) {
    var isValid = true;

    for(var attribute in object) {
      isValid = false;

      for(i = 0; i < metadata.attributes.length; i++){
        var metadataAttibute = metadata.attributes[i];

        if(metadataAttibute.name == attribute){
          isValid = true;
          break;
        }
      }

      if(!isValid){
        return false;
      }
    }

    return isValid;
  };

  constructor.prototype.getAllAsync = function(metadata) {
    var script = 'SELECT * FROM ' + metadata.name;
    var deferred = async.defer();

    queryAsync(script)
      .then(function onSuccess(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
         output.push(result.rows.item(i));
        }

        deferred.resolve(output);
      }, function onError(error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.getAllWhereAsync = function(metadata, conditionAttribute, conditionValue) {
    var script = 'SELECT * FROM ' + metadata.name + ' WHERE ' + conditionAttribute + ' = ?';
    var deferred = async.defer();

    queryAsync(script, [ conditionValue ])
      .then(function onSuccess(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
         output.push(result.rows.item(i));
        }

        deferred.resolve(output);
      }, function onError(error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.getFirstWhereAsync = function(metadata, conditionAttribute, conditionValue) {
    var script = 'SELECT * FROM ' + metadata.name + ' WHERE ' + conditionAttribute + ' = ? LIMIT 1';
    var deferred = async.defer();

    queryAsync(script, [ conditionValue ])
      .then(function onSuccess(result) {
        deferred.resolve(result.rows.item(0));
      }, function onError(error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.existsAsync = function(metadata, conditionAttribute, conditionValue) {
    var script = 'SELECT * FROM ' + metadata.name + ' WHERE ' + conditionAttribute + ' = ? LIMIT 1';
    var deferred = async.defer();

    queryAsync(script, [ conditionValue ])
      .then(function onSuccess(result) {
         deferred.resolve(result && result.rows && result.rows.item(0));
      }, function onError(error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.createAsync = function(metadata, object) {
    var deferred = async.defer();

    if(!isValidObject(metadata, object)) {
      deferred.reject('El objeto a crear es inválido, ya que no matchea con la metadata esperada de ' + metadata.name);

      return deferred.promise;
    }

    var script = 'INSERT OR REPLACE INTO ' + metadata.name;
    var fieldsText = ' (';
    var valuesText = ' VALUES (';
    var values = [];

    for(var i = 0; i < metadata.attributes.length; i ++) {

      fieldsText += i == metadata.attributes.length - 1 ?
        metadata.attributes[i].name + ')' :
        metadata.attributes[i].name + ', ';

      valuesText += i == metadata.attributes.length - 1 ? '?)' : '?, ';

      var value = object[metadata.attributes[i].name] != undefined ? object[metadata.attributes[i].name] : null;

      if(Array.isArray(value)) {
        value = value.join();
      }

      values.push(value);
    }

    script += fieldsText + valuesText;

    queryAsync(script, values)
      .then(function onSuccess(result) {
        deferred.resolve(true);
      }, function onError(error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.deleteAsync = function(metadata) {
      var deferred = async.defer();

      queryAsync('DELETE FROM ' + metadata.name)
        .then(function onSuccess(result) {
          deferred.resolve(true);
        }, function onError(error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

  return constructor;
}());

cartilla.namespace('cartilla.data.DataBaseDataProvider');

cartilla.data.DataBaseDataProvider = (function() {
  var async;
  var db;

  var constructor = function($q, database) {
    async = $q;
    db = database;
  };

  constructor.prototype.getAfiliadoAsync = function() {
    var deferred = async.defer();

    db.getAllAsync(cartilla.model.Afiliado.getMetadata())
      .then(function onSuccess(afiliados) {
        if(afiliados && afiliados.length > 0) {
          deferred.resolve(new cartilla.model.Afiliado(afiliados[0]));
        } else {
          deferred.resolve(null);
        }
      }, function onError(error) {
        deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.addAfiliadoAsync = function(afiliado) {
    var deferred = async.defer();

    db.deleteAsync(cartilla.model.Afiliado.getMetadata())
      .then(function onSuccess(deleted) {
        if(deleted) {
          db.createAsync(cartilla.model.Afiliado.getMetadata(), afiliado)
            .then(function onSuccess(created) {
              deferred.resolve(created);
            }, function onError(error) {
              deferred.reject(new cartilla.exceptions.DataException(error));
            });
        } else {
          deferred.resolve(false);
        }
      }, function onError(error) {
        deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getEspecialidadesAsync = function() {
    var deferred = async.defer();

    var getResult = function(especialidades) {
     var result = [];

     for(var i = 0; i < especialidades.length; i++) {
       result.push(new cartilla.model.Especialidad(especialidades[i]));
     }

     return result;
    };

    db.getAllAsync(cartilla.model.Especialidad.getMetadata())
      .then(function onSuccess(especialidades) {
         if(especialidades.length == 0) {
            var data = cartilla.data.init.Especialidades;

            for(var i = 0; i < data.length; i++) {
              db.createAsync(cartilla.model.Especialidad.getMetadata(), data[i])
                .then(function onSuccess(result) {
                }, function onError(error) {
                  deferred.reject(new cartilla.exceptions.DataException(error));
                });
            }

            db.getAllAsync(cartilla.model.Especialidad.getMetadata())
              .then(function onSuccess(especialidades) {
                deferred.resolve(getResult(especialidades));
              }, function onError(error) {
                 deferred.reject(new cartilla.exceptions.DataException(error));
              });
         } else {
          deferred.resolve(getResult(especialidades));
         }
      }, function onError(error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getProvinciasAsync = function() {
    var deferred = async.defer();

    var getResult = function(provincias) {
     var result = [];

     for(var i = 0; i < provincias.length; i++) {
       result.push(new cartilla.model.Provincia(provincias[i]));
     }

     return result;
    };

    db.getAllAsync(cartilla.model.Provincia.getMetadata())
      .then(function onSuccess(provincias) {
         if(provincias.length == 0) {
            var data = cartilla.data.init.Provincias;

            for(var i = 0; i < data.length; i++) {
              db.createAsync(cartilla.model.Provincia.getMetadata(), data[i])
                .then(function onSuccess(result) {
                }, function onError(error) {
                  deferred.reject(new cartilla.exceptions.DataException(error));
                });
            }

            db.getAllAsync(cartilla.model.Provincia.getMetadata())
              .then(function onSuccess(provincias) {
                deferred.resolve(getResult(provincias));
              }, function onError(error) {
                 deferred.reject(new cartilla.exceptions.DataException(error));
              });
         } else {
          deferred.resolve(getResult(provincias));
         }
      }, function onError(error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getLocalidadesAsync = function() {
    var deferred = async.defer();

    var getResult = function(localidades) {
     var result = [];

     for(var i = 0; i < localidades.length; i++) {
       result.push(new cartilla.model.Localidad(localidades[i]));
     }

     return result;
    };

    db.getAllAsync(cartilla.model.Localidad.getMetadata())
      .then(function onSuccess(localidades) {
         if(localidades.length == 0) {
            var data = cartilla.data.init.Localidades;

            for(var i = 0; i < data.length; i++) {
              db.createAsync(cartilla.model.Localidad.getMetadata(), data[i])
                .then(function onSuccess(result) {
                }, function onError(error) {
                  deferred.reject(new cartilla.exceptions.DataException(error));
                });
            }

            db.getAllAsync(cartilla.model.Localidad.getMetadata())
              .then(function onSuccess(localidades) {
                deferred.resolve(getResult(localidades));
              }, function onError(error) {
                 deferred.reject(new cartilla.exceptions.DataException(error));
              });
         } else {
          deferred.resolve(getResult(localidades));
         }
      }, function onError(error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getPrestadoresAsync = function() {
    var deferred = async.defer();

    db.getAllAsync(cartilla.model.Prestador.getMetadata())
      .then(function onSuccess(prestadores){
         var result = [];

         for(var i = 0; i < prestadores.length; i++) {
           result.push(new cartilla.model.Prestador(prestadores[i]));
         }

         deferred.resolve(result);
      }, function onError(error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getPrestadoresByAsync = function(attribute, value) {
    var deferred = async.defer();

    db.getAllWhereAsync(cartilla.model.Prestador.getMetadata(), attribute, value)
      .then(function onSuccess(prestadores){
         var result = [];

         for(var i = 0; i < prestadores.length; i++) {
           result.push(new cartilla.model.Prestador(prestadores[i]));
         }

         deferred.resolve(result);
      }, function onError(error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getPrestadorByAsync = function(attribute, value) {
    var deferred = async.defer();

    db.getFirstWhereAsync(cartilla.model.Prestador.getMetadata(), attribute, value)
      .then(function onSuccess(prestador){
         deferred.resolve(new cartilla.model.Prestador(prestador));
      }, function onError(error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.actualizarCartillaAsync = function(cartillaData) {
    var deferred = async.defer();

    if(!cartillaData) {
      deferred.resolve(false);
    }

    var updated = 0;

    db.deleteAsync(cartilla.model.Prestador.getMetadata())
      .then(function onSuccess(deleted) {
        if(deleted) {
          for(var i = 0; i < cartillaData.length; i++) {
            db.createAsync(cartilla.model.Prestador.getMetadata(), cartillaData[i].prestadorTO)
              .then(function onSuccess(result) {
                if(result) {
                  updated++;
                }

                if(updated == cartillaData.length) {
                  deferred.resolve(true);
                }
              }, function onError(error) {
                deferred.reject(new cartilla.exceptions.DataException(error));
              });
          }
        } else {
          deferred.resolve(false);
        }
      }, function onError(error) {
        deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  return constructor;
}());

cartilla.namespace('cartilla.data.StaticDataProvider');

cartilla.data.StaticDataProvider = (function() {
  var async;

  var afiliado = {
    nombre: 'Afiliado prueba 1',
    dni: 31372955,
    cuil: 20313729550,
    sexo: 'M',
    plan: 'Plata'
  };

  var getAfiliados = function() {
   return [
     new cartilla.model.Afiliado(afiliado)
   ];
  };
  var getEspecialidades = function() {
   return [
     new cartilla.model.Especialidad({nombre: 'Odontología'}),
     new cartilla.model.Especialidad({nombre: 'Pediatría'}),
     new cartilla.model.Especialidad({nombre: 'Traumatología'}),
     new cartilla.model.Especialidad({nombre: 'LABORATORIO DE ANÁLISIS CLÍNICO'})
   ];
  };
  var getLocalidades =  function() {
    return [
     new cartilla.model.Localidad({nombre: 'Santos Lugares'}),
     new cartilla.model.Localidad({nombre: 'Devoto'}),
     new cartilla.model.Localidad({nombre: 'Paso de Los Libres'})
    ];
  };
  var getProvincias = function() {
   return [
     new cartilla.model.Provincia({nombre: 'Buenos Aires'}),
     new cartilla.model.Provincia({nombre: 'Corrientes'}),
     new cartilla.model.Provincia({nombre: 'Capital Federal'})
   ];
  };
  var getPrestadores = function() {
   return [
      new cartilla.model.Prestador({id: 1, nombre: 'Mauro Agnoletti', especialidad: 'LABORATORIO DE ANÁLISIS CLÍNIC', calle: 'AGUERO', numeroCalle: 1425, piso: 1, departamento: 'A', localidad: 'RECOLETA', zona: 'CAPITAL FEDERAL', codigoPostal: 555, latitud: -34.595140, longitud: -58.409447, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
      new cartilla.model.Prestador({id: 2, nombre: 'Facundo Costa Zini', especialidad: 'CARDIOLOGÍA', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
      new cartilla.model.Prestador({id: 3, nombre: 'Dario Camarro', especialidad: 'LABORATORIO DE ANÁLISIS CLÍNIC', calle: 'AV B RIVADAVIA', numeroCalle: 1424, piso: 8, departamento: '', localidad: 'CABALLITO', zona: 'CAPITAL FEDERAL', codigoPostal: 5170, latitud: -34.619247, longitud: -58.438518, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
      new cartilla.model.Prestador({id: 4, nombre: 'Facundo Costa Zini', especialidad: 'Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
      new cartilla.model.Prestador({id: 5, nombre: 'Facundo Costa Zini', especialidad: 'CARDIOLOGÍA, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontología, OdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontología, OdontologíaOdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontologíaOdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'})
    ];
  };

  var constructor = function($q) {
    async = $q;
  };

  constructor.prototype.getAfiliadoAsync = function() {
    var deferred = async.defer();

    deferred.resolve(getAfiliados()[0]);

    return deferred.promise;
  };

  constructor.prototype.addAfiliadoAsync = function(afiliado) {
    var deferred = async.defer();

    afiliado = {
      nombre: afiliado.nombre,
      dni: afiliado.dni,
      cuil: afiliado.cuil,
      sexo: afiliado.sexo,
      plan: afiliado.plan
    };

    deferred.resolve(true);

    return deferred.promise;
  };

  constructor.prototype.getEspecialidadesAsync = function() {
    var deferred = async.defer();

    deferred.resolve(getEspecialidades());

    return deferred.promise;
  };

  constructor.prototype.getProvinciasAsync = function() {
    var deferred = async.defer();

    deferred.resolve(getProvincias());

    return deferred.promise;
  };

  constructor.prototype.getLocalidadesAsync = function() {
    var deferred = async.defer();

    deferred.resolve(getLocalidades());

    return deferred.promise;
  };

  constructor.prototype.getPrestadoresAsync = function() {
    var deferred = async.defer();

    deferred.resolve(getPrestadores());

    return deferred.promise;
  };

  constructor.prototype.getPrestadoresByAsync = function(attribute, value) {
    var deferred = async.defer();

    deferred.resolve(getPrestadores());

    return deferred.promise;
  };

  constructor.prototype.getPrestadorByAsync = function(attribute, value) {
    var deferred = async.defer();

    deferred.resolve(getPrestadores()[0]);

    return deferred.promise;
  };

  constructor.prototype.actualizarCartillaAsync = function(cartillaData) {
  };

  return constructor;
}());

cartilla.namespace('cartilla.data.init');
cartilla.namespace('cartilla.data.init.Especialidades');

cartilla.data.init.Especialidades = (function() {
  return [
   {
     "especialidad_id":1,
     "descripcion":"MEDICO REFERENTE CLÍNICO"
   },
   {
     "especialidad_id":2,
     "descripcion":"MEDICO REFERENTE PEDIÁTRICO"
   },
   {
     "especialidad_id":4,
     "descripcion":"POLICONSULTORIO"
   },
   {
     "especialidad_id":6,
     "descripcion":"CARDIOLOGÍA"
   },
   {
     "especialidad_id":7,
     "descripcion":"CARDIOLOGÍA INFANTIL"
   },
   {
     "especialidad_id":8,
     "descripcion":"CIRUGÍA GENERAL"
   },
   {
     "especialidad_id":9,
     "descripcion":"CIRUGÍA CARDIOVASCULAR"
   },
   {
     "especialidad_id":10,
     "descripcion":"GERIATRÍA"
   },
   {
     "especialidad_id":12,
     "descripcion":"DERMATOLOGÍA"
   },
   {
     "especialidad_id":13,
     "descripcion":"ENDOCRINOLOGÍA"
   },
   {
     "especialidad_id":14,
     "descripcion":"GASTROENTEROLOGÍA"
   },
   {
     "especialidad_id":15,
     "descripcion":"HEMATOLOGÍA"
   },
   {
     "especialidad_id":16,
     "descripcion":"INFECTOLOGIA"
   },
   {
     "especialidad_id":17,
     "descripcion":"NEFROLOGÍA"
   },
   {
     "especialidad_id":18,
     "descripcion":"NEUMONOLOGÍA"
   },
   {
     "especialidad_id":19,
     "descripcion":"NEUROCIRUGÍA"
   },
   {
     "especialidad_id":20,
     "descripcion":"NEUROCIRUGÍA INFANTIL"
   },
   {
     "especialidad_id":21,
     "descripcion":"NEUROLOGÍA"
   },
   {
     "especialidad_id":22,
     "descripcion":"NEUROLOGÍA INFANTIL"
   },
   {
     "especialidad_id":24,
     "descripcion":"OFTALMOLOGÍA"
   },
   {
     "especialidad_id":25,
     "descripcion":"OFTALMOLOGÍA INFANTIL"
   },
   {
     "especialidad_id":26,
     "descripcion":"ONCOLOGÍA"
   },
   {
     "especialidad_id":27,
     "descripcion":"ONCOLOGÍA INFANTIL"
   },
   {
     "especialidad_id":28,
     "descripcion":"ORTOPEDIA Y TRAUMATOLOGÍA"
   },
   {
     "especialidad_id":29,
     "descripcion":"ORTOPEDIA Y TRAUMATOLOGÍA INFANTIL"
   },
   {
     "especialidad_id":30,
     "descripcion":"OTORRINOLARINGOLOGÍA"
   },
   {
     "especialidad_id":31,
     "descripcion":"OTORRINOLARINGOLOGÍA INFANTIL"
   },
   {
     "especialidad_id":32,
     "descripcion":"PATOLOGÍA MAMARIA"
   },
   {
     "especialidad_id":33,
     "descripcion":"PROCTOLOGÍA"
   },
   {
     "especialidad_id":34,
     "descripcion":"REUMATOLOGÍA"
   },
   {
     "especialidad_id":35,
     "descripcion":"UROLOGÍA"
   },
   {
     "especialidad_id":36,
     "descripcion":"ANÁLISIS DE LABORATORIO"
   },
   {
     "especialidad_id":37,
     "descripcion":"RADIOGRAFÍAS"
   },
   {
     "especialidad_id":39,
     "descripcion":"ODONTOPEDIATRÍA"
   },
   {
     "especialidad_id":40,
     "descripcion":"SALUD MENTAL"
   },
   {
     "especialidad_id":41,
     "descripcion":"RADIOLOGÍA ODONTOLÓGICA"
   },
   {
     "especialidad_id":42,
     "descripcion":"INTERNACIÓN"
   },
   {
     "especialidad_id":43,
     "descripcion":"ODONTOLOGÍA GENERAL"
   },
   {
     "especialidad_id":44,
     "descripcion":"ODONTOLOGÍA"
   },
   {
     "especialidad_id":45,
     "descripcion":"ODONTOLGÍA"
   },
   {
     "especialidad_id":46,
     "descripcion":"ODONTOLOGÍA"
   },
   {
     "especialidad_id":47,
     "descripcion":"ODONTOLOGÍA"
   },
   {
     "especialidad_id":48,
     "descripcion":"ODONTOLOGÍA"
   },
   {
     "especialidad_id":49,
     "descripcion":"URGENCIAS"
   },
   {
     "especialidad_id":50,
     "descripcion":"FARMACIA"
   },
   {
     "especialidad_id":51,
     "descripcion":"ANATOMÍA PATOLÓGICA"
   },
   {
     "especialidad_id":52,
     "descripcion":"FLEBOLOGÍA"
   },
   {
     "especialidad_id":53,
     "descripcion":"FONOAUDIOLOGÍA"
   },
   {
     "especialidad_id":54,
     "descripcion":"KINESIOLOGÍA"
   },
   {
     "especialidad_id":57,
     "descripcion":"CIRUGÍA GINECOLÓGICA"
   },
   {
     "especialidad_id":60,
     "descripcion":"CIRUGÍA PLÁSTICA Y REPARADORA"
   },
   {
     "especialidad_id":72,
     "descripcion":"URGENCIAS ODONTOLOGICAS"
   },
   {
     "especialidad_id":73,
     "descripcion":"URGENCIAS SALUD MENTAL"
   },
   {
     "especialidad_id":74,
     "descripcion":"ANESTESIAS"
   },
   {
     "especialidad_id":75,
     "descripcion":"GINECOLOGÍA"
   },
   {
     "especialidad_id":78,
     "descripcion":"ALERGIA E INMUNOLGÍA INFANTIL"
   },
   {
     "especialidad_id":79,
     "descripcion":"CIRUGÍA CABEZA Y CUELLO"
   },
   {
     "especialidad_id":80,
     "descripcion":"CIRUGÍA ARTROSCÓPICA"
   },
   {
     "especialidad_id":81,
     "descripcion":"CIRUGÍA INFANTIL"
   },
   {
     "especialidad_id":85,
     "descripcion":"URGENCIAS OFTALMOLÓGICAS"
   },
   {
     "especialidad_id":86,
     "descripcion":"URGENCIAS OTORRINOLARINGOLÓGICAS"
   },
   {
     "especialidad_id":88,
     "descripcion":"DIABETES Y NUTRICIÓN"
   },
   {
     "especialidad_id":89,
     "descripcion":"CIRUGÍA VASCULAR PERIFÉRICA"
   },
   {
     "especialidad_id":90,
     "descripcion":"HEMATOLOGIA INFANTIL"
   },
   {
     "especialidad_id":91,
     "descripcion":"HEMODINAMIA"
   },
   {
     "especialidad_id":92,
     "descripcion":"NEUMONOLOGÍA INFANTIL"
   },
   {
     "especialidad_id":94,
     "descripcion":"NUTRICION INFANTIL"
   },
   {
     "especialidad_id":95,
     "descripcion":"OBSTETRICIA"
   },
   {
     "especialidad_id":99,
     "descripcion":"UROLOGIA INFANTIL"
   },
   {
     "especialidad_id":100,
     "descripcion":"GASTROENTEROLOGÍA INFANTIL"
   },
   {
     "especialidad_id":102,
     "descripcion":"GENÉTICA"
   },
   {
     "especialidad_id":107,
     "descripcion":"MEDICINA NUCLEAR"
   },
   {
     "especialidad_id":113,
     "descripcion":"ALERGIA E INMUNOLOGÍA"
   },
   {
     "especialidad_id":121,
     "descripcion":"REHABILITACION DISCAPACIDAD"
   },
   {
     "especialidad_id":122,
     "descripcion":"OPTICAS"
   },
   {
     "especialidad_id":123,
     "descripcion":"ENDOCRINOLOGÍA INFANTIL"
   }
 ];
}());

cartilla.namespace('cartilla.data.init.Provincias');

cartilla.data.init.Provincias = (function() {
  return [
   {
     "zona_id":3,
     "descripcion":"GBA NORTE"
   },
   {
     "zona_id":10,
     "descripcion":"JUJUY"
   },
   {
     "zona_id":15,
     "descripcion":"CORDOBA"
   },
   {
     "zona_id":36,
     "descripcion":"GBA SUR"
   },
   {
     "zona_id":1,
     "descripcion":"CAPITAL FEDERAL"
   },
   {
     "zona_id":16,
     "descripcion":"NEUQUEN"
   },
   {
     "zona_id":15,
     "descripcion":"CORDOBA"
   },
   {
     "zona_id":30,
     "descripcion":"LA RIOJA"
   },
   {
     "zona_id":16,
     "descripcion":"NEUQUEN"
   },
   {
     "zona_id":17,
     "descripcion":"MENDOZA"
   },
   {
     "zona_id":36,
     "descripcion":"GBA SUR"
   },
   {
     "zona_id":2,
     "descripcion":"BUENOS AIRES (INTERIOR)"
   },
   {
     "zona_id":21,
     "descripcion":"RIO NEGRO"
   },
   {
     "zona_id":22,
     "descripcion":"SALTA"
   },
   {
     "zona_id":3,
     "descripcion":"GBA NORTE"
   },
   {
     "zona_id":30,
     "descripcion":"LA RIOJA"
   },
   {
     "zona_id":21,
     "descripcion":"RIO NEGRO"
   },
   {
     "zona_id":7,
     "descripcion":"GBA OESTE"
   },
   {
     "zona_id":3,
     "descripcion":"GBA NORTE"
   },
   {
     "zona_id":30,
     "descripcion":"LA RIOJA"
   },
   {
     "zona_id":35,
     "descripcion":"SANTA CRUZ"
   },
   {
     "zona_id":35,
     "descripcion":"SANTA CRUZ"
   },
   {
     "zona_id":12,
     "descripcion":"SANTA FE"
   },
   {
     "zona_id":16,
     "descripcion":"NEUQUEN"
   },
   {
     "zona_id":36,
     "descripcion":"GBA SUR"
   },
   {
     "zona_id":10,
     "descripcion":"JUJUY"
   },
   {
     "zona_id":1,
     "descripcion":"CAPITAL FEDERAL"
   },
   {
     "zona_id":22,
     "descripcion":"SALTA"
   },
   {
     "zona_id":3,
     "descripcion":"GBA NORTE"
   },
   {
     "zona_id":16,
     "descripcion":"NEUQUEN"
   },
   {
     "zona_id":17,
     "descripcion":"MENDOZA"
   },
   {
     "zona_id":3,
     "descripcion":"GBA NORTE"
   },
   {
     "zona_id":1,
     "descripcion":"CAPITAL FEDERAL"
   },
   {
     "zona_id":2,
     "descripcion":"BUENOS AIRES (INTERIOR)"
   },
   {
     "zona_id":12,
     "descripcion":"SANTA FE"
   },
   {
     "zona_id":15,
     "descripcion":"CORDOBA"
   },
   {
     "zona_id":15,
     "descripcion":"CORDOBA"
   },
   {
     "zona_id":17,
     "descripcion":"MENDOZA"
   },
   {
     "zona_id":2,
     "descripcion":"BUENOS AIRES (INTERIOR)"
   },
   {
     "zona_id":7,
     "descripcion":"GBA OESTE"
   },
   {
     "zona_id":16,
     "descripcion":"NEUQUEN"
   },
   {
     "zona_id":22,
     "descripcion":"SALTA"
   },
   {
     "zona_id":35,
     "descripcion":"SANTA CRUZ"
   },
   {
     "zona_id":22,
     "descripcion":"SALTA"
   },
   {
     "zona_id":36,
     "descripcion":"GBA SUR"
   },
   {
     "zona_id":10,
     "descripcion":"JUJUY"
   },
   {
     "zona_id":30,
     "descripcion":"LA RIOJA"
   },
   {
     "zona_id":21,
     "descripcion":"RIO NEGRO"
   },
   {
     "zona_id":12,
     "descripcion":"SANTA FE"
   },
   {
     "zona_id":35,
     "descripcion":"SANTA CRUZ"
   },
   {
     "zona_id":2,
     "descripcion":"BUENOS AIRES (INTERIOR)"
   },
   {
     "zona_id":7,
     "descripcion":"GBA OESTE"
   },
   {
     "zona_id":2,
     "descripcion":"BUENOS AIRES (INTERIOR)"
   },
   {
     "zona_id":30,
     "descripcion":"LA RIOJA"
   },
   {
     "zona_id":16,
     "descripcion":"NEUQUEN"
   },
   {
     "zona_id":36,
     "descripcion":"GBA SUR"
   },
   {
     "zona_id":3,
     "descripcion":"GBA NORTE"
   },
   {
     "zona_id":3,
     "descripcion":"GBA NORTE"
   },
   {
     "zona_id":16,
     "descripcion":"NEUQUEN"
   },
   {
     "zona_id":21,
     "descripcion":"RIO NEGRO"
   },
   {
     "zona_id":2,
     "descripcion":"BUENOS AIRES (INTERIOR)"
   },
   {
     "zona_id":1,
     "descripcion":"CAPITAL FEDERAL"
   },
   {
     "zona_id":10,
     "descripcion":"JUJUY"
   },
   {
     "zona_id":12,
     "descripcion":"SANTA FE"
   },
   {
     "zona_id":7,
     "descripcion":"GBA OESTE"
   },
   {
     "zona_id":7,
     "descripcion":"GBA OESTE"
   },
   {
     "zona_id":35,
     "descripcion":"SANTA CRUZ"
   },
   {
     "zona_id":17,
     "descripcion":"MENDOZA"
   },
   {
     "zona_id":12,
     "descripcion":"SANTA FE"
   },
   {
     "zona_id":10,
     "descripcion":"JUJUY"
   },
   {
     "zona_id":22,
     "descripcion":"SALTA"
   },
   {
     "zona_id":21,
     "descripcion":"RIO NEGRO"
   },
   {
     "zona_id":21,
     "descripcion":"RIO NEGRO"
   },
   {
     "zona_id":1,
     "descripcion":"CAPITAL FEDERAL"
   },
   {
     "zona_id":15,
     "descripcion":"CORDOBA"
   },
   {
     "zona_id":7,
     "descripcion":"GBA OESTE"
   },
   {
     "zona_id":1,
     "descripcion":"CAPITAL FEDERAL"
   },
   {
     "zona_id":35,
     "descripcion":"SANTA CRUZ"
   },
   {
     "zona_id":7,
     "descripcion":"GBA OESTE"
   },
   {
     "zona_id":2,
     "descripcion":"BUENOS AIRES (INTERIOR)"
   },
   {
     "zona_id":35,
     "descripcion":"SANTA CRUZ"
   },
   {
     "zona_id":21,
     "descripcion":"RIO NEGRO"
   },
   {
     "zona_id":36,
     "descripcion":"GBA SUR"
   },
   {
     "zona_id":15,
     "descripcion":"CORDOBA"
   },
   {
     "zona_id":15,
     "descripcion":"CORDOBA"
   },
   {
     "zona_id":1,
     "descripcion":"CAPITAL FEDERAL"
   },
   {
     "zona_id":36,
     "descripcion":"GBA SUR"
   },
   {
     "zona_id":30,
     "descripcion":"LA RIOJA"
   },
   {
     "zona_id":17,
     "descripcion":"MENDOZA"
   }
  ];
}());

cartilla.namespace('cartilla.data.init.Localidades');

cartilla.data.init.Localidades = (function() {
  return [
    {
     "barrio_localidad_id":"36BANELD",
     "descripcion":"BANFIELD",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"22METTAN",
     "descripcion":"METAN",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"3ELMAR",
     "descripcion":"EL PALOMAR",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"10LAACA",
     "descripcion":"LA QUIACA",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"15ALICIA",
     "descripcion":"ALICIA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"10ABRMPA",
     "descripcion":"ABRA PAMPA",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"1AG",
     "descripcion":"AGRONOMIA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"10LIBTIN",
     "descripcion":"LIBERTADOR GRAL SAN MARTIN",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"1VCR",
     "descripcion":"VILLA CRESPO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"15SANSCO",
     "descripcion":"SAN FRANCISCO",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"17LASRAS",
     "descripcion":"LAS HERAS",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"2LAATA",
     "descripcion":"LA PLATA",
     "zona_id":2
    },
    {
     "barrio_localidad_id":"36SARNDI",
     "descripcion":"SARANDI",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"1PCH",
     "descripcion":"PARQUE CHACABUCO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"17Maiipu",
     "descripcion":"MAIPU",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"36CLAOLE",
     "descripcion":"CLAYPOLE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"1VER",
     "descripcion":"VERSALLES",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"3SANRES",
     "descripcion":"SAN ANDRES",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"3VILTER",
     "descripcion":"VILLA BALLESTER",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"3Josrez",
     "descripcion":"JOSE LEON SUAREZ",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"35RIOBIO",
     "descripcion":"RIO TURBIO",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"15LAERA",
     "descripcion":"LA CALERA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"35Picado",
     "descripcion":"PICO TRUNCADO",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"10TILARA",
     "descripcion":"TILCARA",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"16CENRIO",
     "descripcion":"CENTENARIO",
     "zona_id":16
    },
    {
     "barrio_localidad_id":"15SANIDA",
     "descripcion":"SAN JOSE DE LA DORMIDA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"7GENUEZ",
     "descripcion":"GENERAL RODRIGUEZ",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"7Barnas",
     "descripcion":"BARRIO LAS CATONAS",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"7MORRON",
     "descripcion":"MORON",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"1ON",
     "descripcion":"ONCE",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"36WILLDE",
     "descripcion":"WILDE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"2LOSLES",
     "descripcion":"LOS CARDALES",
     "zona_id":2
    },
    {
     "barrio_localidad_id":"12RICONE",
     "descripcion":"RICARDONE",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"12PUETIN",
     "descripcion":"PUERTO GRAL SAN MARTIN",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"3GENTIN",
     "descripcion":"GENERAL SAN MARTIN",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"22Lastas",
     "descripcion":"LAS LAJITAS",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"3RICJAS",
     "descripcion":"RICARDO ROJAS",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"15MARREZ",
     "descripcion":"MARCOS JUAREZ",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"15COLOYA",
     "descripcion":"COLONIA CAROYA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"1BA",
     "descripcion":"BARRACAS",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"36TURERA",
     "descripcion":"TURDERA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3ACAUSO",
     "descripcion":"ACASSUSO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"3RINERG",
     "descripcion":"RINCON DE MILBERG",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"35COMENA",
     "descripcion":"COMANDANTE LUIS PIEDRABUENA",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"12TOTRAS",
     "descripcion":"TOTORAS",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"1STE",
     "descripcion":"SAN TELMO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"3LAILA",
     "descripcion":"LA LUCILA",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"22APOVIA",
     "descripcion":"APOLINARIO SARAVIA",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"15Quiino",
     "descripcion":"QUILINO",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"3SANNDO",
     "descripcion":"SAN FERNANDO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"7CASLAR",
     "descripcion":"CASTELAR",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"2MARAJO",
     "descripcion":"MAR DE AJO",
     "zona_id":2
    },
    {
     "barrio_localidad_id":"7ISIOVA",
     "descripcion":"ISIDRO CASANOVA",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"12SANSUD",
     "descripcion":"SAN JERONIMO SUD",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"22SALLTA",
     "descripcion":"SALTA",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"35LOSUOS",
     "descripcion":"LOS ANTIGUOS",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"3528bre",
     "descripcion":"28 DE NOVIEMBRE",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"17COREGO",
     "descripcion":"CORONEL DORREGO",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"1FLA",
     "descripcion":"FLORESTA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"35ELATE",
     "descripcion":"EL CALAFATE",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"12TIMUES",
     "descripcion":"TIMBUES",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"7SANSTO",
     "descripcion":"SAN JUSTO",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"2NECHEA",
     "descripcion":"NECOCHEA",
     "zona_id":2
    },
    {
     "barrio_localidad_id":"36LANNUS",
     "descripcion":"LANUS",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"7TAPLES",
     "descripcion":"TAPIALES",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"36ADRGUE",
     "descripcion":"ADROGUE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"36GERRLI",
     "descripcion":"GERLI",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"1MONS",
     "descripcion":"MONSERRAT",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"16PLACUL",
     "descripcion":"PLAZA HUINCUL",
     "zona_id":16
    },
    {
     "barrio_localidad_id":"12VENRTO",
     "descripcion":"VENADO TUERTO",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"2SANITA",
     "descripcion":"SANTA TERESITA",
     "zona_id":2
    },
    {
     "barrio_localidad_id":"3VILSCH",
     "descripcion":"VILLA BOSCH",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"36AVEEDA",
     "descripcion":"AVELLANEDA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3GENECO",
     "descripcion":"GENERAL PACHECO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"1MAT",
     "descripcion":"MATADEROS",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"1BEL",
     "descripcion":"BELGRANO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"1VDE",
     "descripcion":"VILLA DEVOTO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"36VILICO",
     "descripcion":"VILLA DOMINICO",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"36CRUITA",
     "descripcion":"CRUCESITA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"36REMADA",
     "descripcion":"REMEDIOS DE ESCALADA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"16PLOIER",
     "descripcion":"PLOTTIER",
     "zona_id":16
    },
    {
     "barrio_localidad_id":"12SERINO",
     "descripcion":"SERODINO",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"1VSO",
     "descripcion":"VILLA SOLDATI",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"22CERLOS",
     "descripcion":"CERRILLOS",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"36QUISTE",
     "descripcion":"QUILMES OESTE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"22CAMANO",
     "descripcion":"CAMPO QUIJANO",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"12SANNZO",
     "descripcion":"SAN LORENZO",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"12PTOTIN",
     "descripcion":"PTO GRAL SAN MARTIN",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"10SANJUY",
     "descripcion":"SAN SALVADOR DE JUJUY",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"3DELISO",
     "descripcion":"DEL VISO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"7GREERE",
     "descripcion":"GREGORIO DE LAFERRERE",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"1VOR",
     "descripcion":"VILLA ORTUZAR",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"10HUMACA",
     "descripcion":"HUMAHUACA",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"22LACED",
     "descripcion":"LA MERCED",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"7HAEEDO",
     "descripcion":"HAEDO",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"15ARRITO",
     "descripcion":"ARROYITO",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"1RET",
     "descripcion":"RETIRO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"22TARGAL",
     "descripcion":"TARTAGAL",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"22SANRAN",
     "descripcion":"SAN RAMON DE LA NUEVA ORAN",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"17FRARAN",
     "descripcion":"FRAY LUIS BELTRAN",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"36VALINA",
     "descripcion":"VALENTIN ALSINA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"36Donsco",
     "descripcion":"DON BOSCO",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"22ELRIL",
     "descripcion":"EL CARRIL",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"36BERSTE",
     "descripcion":"BERNAL ESTE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"12GRARIA",
     "descripcion":"GRANADERO BAIGORRIA",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"1VGM",
     "descripcion":"VILLA GRAL.MITRE",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"17SANAEL",
     "descripcion":"SAN RAFAEL",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"15ALTCIA",
     "descripcion":"ALTA GRACIA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"17MENOZA",
     "descripcion":"MENDOZA",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"17Gutrez",
     "descripcion":"GUTIERREZ",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"7Ciuita",
     "descripcion":"CIUDAD EVITA",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"17VILUEL",
     "descripcion":"VILLA ATUEL",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"12CARAÑA",
     "descripcion":"CARCARAÑA",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"1AL",
     "descripcion":"ALMAGRO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"22SANRES",
     "descripcion":"SAN ANTONIO DE LOS COBRES",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"35PERENO",
     "descripcion":"PERITO MORENO",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"3BOUGNE",
     "descripcion":"BOULOGNE",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"21VILINA",
     "descripcion":"VILLA REGINA",
     "zona_id":21
    },
    {
     "barrio_localidad_id":"7MERRLO",
     "descripcion":"MERLO",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"15UNQLLO",
     "descripcion":"UNQUILLO",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"36CAÑLAS",
     "descripcion":"CAÑUELAS",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"17VILLEN",
     "descripcion":"VILLA NUEVA  DE GUAYMALLEN",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"7MORENO",
     "descripcion":"MORENO",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"12PERREZ",
     "descripcion":"PEREZ",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"7ITUNGO",
     "descripcion":"ITUZAINGO",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"35GOBRES",
     "descripcion":"GOBERNADOR GREGORES",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"12ACEBAL",
     "descripcion":"ACEBAL",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"1VSR",
     "descripcion":"VILLA SANTA RITA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"22Picnal",
     "descripcion":"PICHANAL",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"12ALVREZ",
     "descripcion":"ALVAREZ",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"17SANLEN",
     "descripcion":"SAN JOSE DE GUAYMALLEN",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"16NEUUEN",
     "descripcion":"NEUQUEN",
     "zona_id":16
    },
    {
     "barrio_localidad_id":"7Laada",
     "descripcion":"LA TABLADA",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"1SAA",
     "descripcion":"SAAVEDRA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"7ELMAR",
     "descripcion":"EL PALOMAR",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"3ITUNGO",
     "descripcion":"ITUZAINGO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"7MARPAZ",
     "descripcion":"MARCOS PAZ",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"35PUEADO",
     "descripcion":"PUERTO DESEADO",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"12OLIROS",
     "descripcion":"OLIVEROS",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"3DONATO",
     "descripcion":"DON TORCUATO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"36FLOELA",
     "descripcion":"FLORENCIO VARELA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3ELLAR",
     "descripcion":"EL TALAR",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"12ROLDAN",
     "descripcion":"ROLDAN",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"15VILPAZ",
     "descripcion":"VILLA CARLOS PAZ",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"22AGURAY",
     "descripcion":"AGUARAY",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"36BERSTE",
     "descripcion":"BERNAL OESTE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"36QUIMES",
     "descripcion":"QUILMES",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"1NP",
     "descripcion":"NUEVA POMPEYA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"10SANDRO",
     "descripcion":"SAN PEDRO",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"35PUEIAN",
     "descripcion":"PUERTO SAN JULIAN",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"36PIÑYRO",
     "descripcion":"PIÑEYRO",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"17VILLEN",
     "descripcion":"VILLA NUEVA DE GUAYMALLEN",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"3LOSNES",
     "descripcion":"LOS POLVORINES",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"1CONS",
     "descripcion":"CONSTITUCION",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"36LONMPS",
     "descripcion":"LONGCHAMPS",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"7LOMDOR",
     "descripcion":"LOMAS DEL MIRADOR",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"1VSA",
     "descripcion":"VELEZ SARSFIELD",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"3PILLAR",
     "descripcion":"PILAR",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"7CIUERO",
     "descripcion":"CIUDAD MADERO",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"36CARINI",
     "descripcion":"CARLOS SPEGAZZINI",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3BELBAR",
     "descripcion":"BELEN DE ESCOBAR",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"17Salsas",
     "descripcion":"SALTO DE LAS ROSAS",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"12ROSRIO",
     "descripcion":"ROSARIO",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"21GENOCA",
     "descripcion":"GENERAL ROCA",
     "zona_id":21
    },
    {
     "barrio_localidad_id":"1COL",
     "descripcion":"COLEGIALES",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"15SALDAN",
     "descripcion":"SALDAN",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"15RIOERO",
     "descripcion":"RIO PRIMERO",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"12CAPDEZ",
     "descripcion":"CAPITAN BERMUDEZ",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"7VILNTO",
     "descripcion":"VILLA SARMIENTO",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"3TIGGRE",
     "descripcion":"TIGRE",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"15LASLAS",
     "descripcion":"LAS VARILLAS",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"21SANCHE",
     "descripcion":"SAN CARLOS DE BARILOCHE",
     "zona_id":21
    },
    {
     "barrio_localidad_id":"22EMBION",
     "descripcion":"EMBARCACION",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"15MENAZA",
     "descripcion":"MENDIOLAZA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"3FLOSTE",
     "descripcion":"FLORIDA OESTE",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"16CUTCO",
     "descripcion":"CUTRAL CO",
     "zona_id":16
    },
    {
     "barrio_localidad_id":"12SALNDE",
     "descripcion":"SALTO GRANDE",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"1FLO",
     "descripcion":"FLORES",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"36BERGUI",
     "descripcion":"BERAZATEGUI",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"2MARATA",
     "descripcion":"MAR DEL PLATA",
     "zona_id":2
    },
    {
     "barrio_localidad_id":"17TUNYAN",
     "descripcion":"TUNUYAN",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"22ROSRMA",
     "descripcion":"ROSARIO DE LERMA",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"15JESRIA",
     "descripcion":"JESUS MARIA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"12FUNNES",
     "descripcion":"FUNES",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"17GODRUZ",
     "descripcion":"GODOY CRUZ",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"36BURACO",
     "descripcion":"BURZACO",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"17CHARIA",
     "descripcion":"CHACRAS DE CORIA",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"7EZEIZA",
     "descripcion":"EZEIZA",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"22P.zza",
     "descripcion":"P. SALVADOR MAZZA",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"3Muññiz",
     "descripcion":"MUÑIZ",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"10PALALA",
     "descripcion":"PALPALA",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"12VILVEZ",
     "descripcion":"VILLA GOBERNADOR GALVEZ",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"36LOMORA",
     "descripcion":"LOMAS DE ZAMORA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"35Calvia",
     "descripcion":"CALETA OLIVIA",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"3PABSTA",
     "descripcion":"PABLO PODESTA",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"3HURHAM",
     "descripcion":"HURLINGHAM",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"3MARNEZ",
     "descripcion":"MARTINEZ",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"35RIOGOS",
     "descripcion":"RIO GALLEGOS",
     "zona_id":35
    },
    {
     "barrio_localidad_id":"16Sandes",
     "descripcion":"SAN MARTIN DE LOS ANDES",
     "zona_id":16
    },
    {
     "barrio_localidad_id":"1PP",
     "descripcion":"PARQUE PATRICIOS",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"15RIOERO",
     "descripcion":"RIO TERCERO",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"3BELSTA",
     "descripcion":"BELLA VISTA",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"3VILLLI",
     "descripcion":"VILLA MARTELLI",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"3FLOIDA",
     "descripcion":"FLORIDA",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"22GENMES",
     "descripcion":"GENERAL GUEMES",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"1PAV",
     "descripcion":"PARQUE AVELLANEDA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"7SANDUA",
     "descripcion":"SAN ANTONIO DE PADUA",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"17Lavlle",
     "descripcion":"LAVALLE",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"1BN",
     "descripcion":"BARRIO NORTE",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"36JOSMOL",
     "descripcion":"JOSE MARMOL",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"1VRI",
     "descripcion":"VILLA RIACHUELO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"36SOUUES",
     "descripcion":"SOURIGUES",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"15Vilral",
     "descripcion":"VILLA DEL TOTORAL",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"7GENRAS",
     "descripcion":"GENERAL LAS HERAS",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"15VILRIO",
     "descripcion":"VILLA DEL ROSARIO",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"16ZAPALA",
     "descripcion":"ZAPALA",
     "zona_id":16
    },
    {
     "barrio_localidad_id":"7PASREY",
     "descripcion":"PASO DEL REY",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"17VILAGA",
     "descripcion":"VILLA LUZURIAGA",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"10PERICO",
     "descripcion":"PERICO",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"1COG",
     "descripcion":"COGHLAN",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"7VILSEI",
     "descripcion":"VILLA SANTOS TESEI",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"15RIOLOS",
     "descripcion":"RIO CEBALLOS",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"17LUJUYO",
     "descripcion":"LUJAN DE CUYO",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"3BECCAR",
     "descripcion":"BECCAR",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"1VPY",
     "descripcion":"VILLA PUEYRREDON",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"7PARTIN",
     "descripcion":"PARQUE SAN MARTIN",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"1SCR",
     "descripcion":"SAN CRISTOBAL",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"1LIN",
     "descripcion":"LINIERS",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"22CHIANA",
     "descripcion":"CHICOANA",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"36VILONE",
     "descripcion":"VILLA VATTEONE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3CIUMAR",
     "descripcion":"CIUDAD JARDIN DEL PALOMAR",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"3OLIVOS",
     "descripcion":"OLIVOS",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"22ROSERA",
     "descripcion":"ROSARIO DE LA FRONTERA",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"1",
     "descripcion":"- TODAS -",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"36MONNDE",
     "descripcion":"MONTE GRANDE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3SANDRO",
     "descripcion":"SAN ISIDRO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"1VLU",
     "descripcion":"VILLA LUGANO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"7CIUELA",
     "descripcion":"CIUDADELA",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"3CARHAY",
     "descripcion":"CARAPACHAY",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"21CIPTTI",
     "descripcion":"CIPOLLETTI",
     "zona_id":21
    },
    {
     "barrio_localidad_id":"7GONTAN",
     "descripcion":"GONZALEZ CATAN",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"15Saldes",
     "descripcion":"SALSIPUEDES",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"36EZEIZA",
     "descripcion":"EZEIZA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"36EZPSTE",
     "descripcion":"EZPELETA OESTE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"22JOALEZ",
     "descripcion":"JOAQUIN V GONZALEZ",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"7Vilero",
     "descripcion":"VILLA MADERO",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"1LB",
     "descripcion":"BOCA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"22COLOSA",
     "descripcion":"COLONIA SANTA ROSA",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"17GUALEN",
     "descripcion":"GUAYMALLEN",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"3ZARATE",
     "descripcion":"ZARATE",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"10MONICO",
     "descripcion":"MONTERRICO",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"2ZARATE",
     "descripcion":"ZARATE",
     "zona_id":2
    },
    {
     "barrio_localidad_id":"3ELDOR",
     "descripcion":"EL LIBERTADOR",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"15VILNDE",
     "descripcion":"VILLA ALLENDE",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"1BOE",
     "descripcion":"BOEDO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"1PA",
     "descripcion":"PALERMO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"1CTR",
     "descripcion":"CENTRO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"15VILRIA",
     "descripcion":"VILLA MARIA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"7TABADA",
     "descripcion":"TABLADA",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"12IBACEA",
     "descripcion":"IBARLUCEA",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"36TEMLEY",
     "descripcion":"TEMPERLEY",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"1CHA",
     "descripcion":"CHACARITA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"2SANMAR",
     "descripcion":"SANTA CLARA DEL MAR",
     "zona_id":2
    },
    {
     "barrio_localidad_id":"15COROBA",
     "descripcion":"CORDOBA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"15DEANES",
     "descripcion":"DEAN FUNES",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"3MUNNRO",
     "descripcion":"MUNRO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"17Roddio",
     "descripcion":"RODEO DEL MEDIO",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"3VICPEZ",
     "descripcion":"VICENTE LOPEZ",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"12SOLINI",
     "descripcion":"SOLDINI",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"22CAFATE",
     "descripcion":"CAFAYATE",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"1CONG",
     "descripcion":"CONGRESO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"1VLR",
     "descripcion":"VILLA LURO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"12FRARAN",
     "descripcion":"FRAY LUIS BELTRAN",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"36SANANO",
     "descripcion":"SAN FRANCISCO SOLANO",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"30LAOJA",
     "descripcion":"LA RIOJA",
     "zona_id":30
    },
    {
     "barrio_localidad_id":"3GRAURG",
     "descripcion":"GRAND BOURG",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"36LAATA",
     "descripcion":"LA PLATA",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3SANUEL",
     "descripcion":"SAN MIGUEL",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"36EZPSTE",
     "descripcion":"EZPELETA ESTE",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"15COSUIN",
     "descripcion":"COSQUIN",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"3JOSPAZ",
     "descripcion":"JOSE CLEMENTE PAZ",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"1PAT",
     "descripcion":"PATERNAL",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"3MARADO",
     "descripcion":"MARTIN CORONADO",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"21ALLLEN",
     "descripcion":"ALLEN",
     "zona_id":21
    },
    {
     "barrio_localidad_id":"21CINTOS",
     "descripcion":"CINCO SALTOS",
     "zona_id":21
    },
    {
     "barrio_localidad_id":"36LLALOL",
     "descripcion":"LLAVALLOL",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3TORTAS",
     "descripcion":"TORTUGUITAS",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"36GLELEW",
     "descripcion":"GLEW",
     "zona_id":36
    },
    {
     "barrio_localidad_id":"3VIRYES",
     "descripcion":"VIRREYES",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"1VPQ",
     "descripcion":"VILLA DEL PARQUE",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"1VUR",
     "descripcion":"VILLA URQUIZA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"17GENTIN",
     "descripcion":"GENERAL SAN MARTIN",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"7RAMJIA",
     "descripcion":"RAMOS MEJIA",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"3VICRIA",
     "descripcion":"VICTORIA",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"17MALGUE",
     "descripcion":"MALARGUE",
     "zona_id":17
    },
    {
     "barrio_localidad_id":"1CAB",
     "descripcion":"CABALLITO",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"1REC",
     "descripcion":"RECOLETA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"3Casros",
     "descripcion":"CASEROS",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"1BAL",
     "descripcion":"BALVANERA",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"3VILINA",
     "descripcion":"VILLA ADELINA",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"12ANDINO",
     "descripcion":"ANDINO",
     "zona_id":12
    },
    {
     "barrio_localidad_id":"1NU",
     "descripcion":"NUÑEZ",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"16S.Pñar",
     "descripcion":"S.P. CHAÑAR",
     "zona_id":16
    },
    {
     "barrio_localidad_id":"3SANRES",
     "descripcion":"SANTOS LUGARES",
     "zona_id":3
    },
    {
     "barrio_localidad_id":"22Elpon",
     "descripcion":"EL GALPON",
     "zona_id":22
    },
    {
     "barrio_localidad_id":"15Lalda",
     "descripcion":"LA FALDA",
     "zona_id":15
    },
    {
     "barrio_localidad_id":"1SNI",
     "descripcion":"SAN NICOLÁS",
     "zona_id":1
    },
    {
     "barrio_localidad_id":"7VILBLE",
     "descripcion":"VILLA INSUPERABLE",
     "zona_id":7
    },
    {
     "barrio_localidad_id":"10ELMEN",
     "descripcion":"EL CARMEN",
     "zona_id":10
    },
    {
     "barrio_localidad_id":"7MARSTA",
     "descripcion":"MARIANO ACOSTA",
     "zona_id":7
    }
  ];
}());
