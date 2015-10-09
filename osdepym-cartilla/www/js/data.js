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
  var configuration;
  var db;
  var initialized = false;

  var constructor = function($sqlite, $q, config) {
    sqlite = $sqlite;
    async = $q;
    configuration = config;
  };

  var checkInitialization = function(deferred) {
    if(!initialized) {
      deferred.reject(new Error('El data provider no ha sido inicializado'));
    }

    return initialized;
  };

  var dropTable = function(metadata) {
    var script = 'DROP TABLE ' + metadata.name;

    sqlite.execute(db, script);
  };

  var initializeTable = function(metadata) {
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

  var getCreateStatement = function(metadata, object) {
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

    return {script: script, values: values};
  };

  constructor.prototype.initialize = function() {
    if(initialized) {
      return;
    }

    if (window.cordova && window.SQLitePlugin) {
      db = sqlite.openDB({ name: configuration.dbName, bgType: 1 });
    } else {
      db = window.openDatabase(configuration.dbName, '1.0', configuration.dbName, 100 * 1024 * 1024);
    }

    if(configuration.reCreateDataBase) {
      dropTable(cartilla.model.Afiliado.getMetadata());
      dropTable(cartilla.model.Prestador.getMetadata());
    }

    initializeTable(cartilla.model.Afiliado.getMetadata());
    initializeTable(cartilla.model.Prestador.getMetadata());

    initialized = true;
  };

  constructor.prototype.getByQueryAsync = function(query, values){
      var deferred = async.defer();

      queryAsync(query, values)
        .then(function (result) {
          var output = [];

          for (var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
          }

          deferred.resolve(output);
        }, function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    };

  constructor.prototype.getAllAsync = function(metadata, selectField) {
    var deferred = async.defer();

    if(!checkInitialization(deferred)) {
      return deferred.promise;
    }

    var field = selectField && selectField !== '' ? 'DISTINCT ' + selectField : '*';
    var script = 'SELECT ' + field + ' FROM ' + metadata.name;

    queryAsync(script)
      .then(function (result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
         output.push(result.rows.item(i));
        }

        deferred.resolve(output);
      }, function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.getAllWhereAsync = function(metadata, criteria, selectField) {
    var deferred = async.defer();

    if(!checkInitialization(deferred)) {
      return deferred.promise;
    }

    var field = selectField && selectField !== '' ? 'DISTINCT ' + selectField : '*';
    var script = 'SELECT ' + field + ' FROM ' + metadata.name;
    var values = [];

    if(criteria) {
      script += ' WHERE ';

      var i = 1;
      var length = Object.keys(criteria).length;

      for(var attribute in criteria) {
        script += attribute + ' = ?';
        values.push(criteria[attribute]);

        if(i !== length) {
          script += ' AND ';
          i++;
        }
      }
    }

    queryAsync(script, values)
      .then(function (result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
         output.push(result.rows.item(i));
        }

        deferred.resolve(output);
      }, function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.getFirstWhereAsync = function(metadata, criteria, selectField) {
    var deferred = async.defer();

    if(!checkInitialization(deferred)) {
      return deferred.promise;
    }

    var field = selectField && selectField !== '' ? 'DISTINCT ' + selectField : '*';
    var script = 'SELECT ' + field + ' FROM ' + metadata.name;
    var values = [];

    if(criteria) {
      script += ' WHERE ';

      var i = 1;
      var length = Object.keys(criteria).length;

      for(var attribute in criteria) {
        script += attribute + ' = ?';
        values.push(criteria[attribute]);

        if(i !== length) {
          script += ' AND ';
          i++;
        }
      }
    }

    script += ' LIMIT 1';

    queryAsync(script, values)
      .then(function (result) {
        deferred.resolve(result && result.rows ? result.rows.item(0) : null);
      }, function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.existsAsync = function(metadata, criteria) {
    var deferred = async.defer();

    if(!checkInitialization(deferred)) {
      return deferred.promise;
    }

    var script = 'SELECT * FROM ' + metadata.name;
    var values = [];

    if(criteria) {
      script += ' WHERE ';

      var i = 1;
      var length = Object.keys(criteria).length;

      for(var attribute in criteria) {
        script += attribute + ' = ?';
        values.push(criteria[attribute]);

        if(i !== length) {
          script += ' AND ';
          i++;
        }
      }
    }

    script += ' LIMIT 1';

    queryAsync(script, values)
      .then(function (result) {
         deferred.resolve(result && result.rows && result.rows.item(0));
      }, function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.createAsync = function(metadata, objects) {
    var deferred = async.defer();

    if(!checkInitialization(deferred)) {
      return deferred.promise;
    }

    db.transaction(function(tx) {
      if((objects && !objects.length)){
        objects = [objects];
      }
      for(var i = 0; i < objects.length; i++) {
        var object = objects[i];

        if(!isValidObject(metadata, object)) {
           deferred.reject(new Error('El objeto a crear es inválido, ya que no matchea con la metadata esperada de ' + metadata.name));
           break;
        }

        var statement = getCreateStatement(metadata, object);

        tx.executeSql(statement.script, statement.values, function(result) {}, function(error) {
          deferred.reject(error);
        });
      }
    }, function (error) {
      deferred.reject(error);
    }, function () {
      deferred.resolve(true);
    });

    return deferred.promise;
  };

  constructor.prototype.deleteAsync = function(metadata) {
      var deferred = async.defer();

      if(!checkInitialization(deferred)) {
        return deferred.promise;
      }

      queryAsync('DELETE FROM ' + metadata.name)
        .then(function (result) {
          deferred.resolve(true);
        }, function (error) {
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

  constructor.prototype.initialize = function() {
    db.initialize();
  };

  constructor.prototype.getAfiliadoAsync = function() {
    var deferred = async.defer();

    db.getAllAsync(cartilla.model.Afiliado.getMetadata())
      .then(function (afiliados) {
        if(afiliados && afiliados.length > 0) {
          deferred.resolve(new cartilla.model.Afiliado(afiliados[0]));
        } else {
          deferred.resolve(null);
        }
      }, function (error) {
        deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.addAfiliadoAsync = function(afiliado) {
    var deferred = async.defer();

    db.deleteAsync(cartilla.model.Afiliado.getMetadata())
      .then(function (deleted) {
        if(deleted) {
          db.createAsync(cartilla.model.Afiliado.getMetadata(), afiliado)
            .then(function (created) {
              deferred.resolve(created);
            }, function (error) {
              deferred.reject(new cartilla.exceptions.DataException(error));
            });
        } else {
          deferred.resolve(false);
        }
      }, function (error) {
        deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getEspecialidadesAsync = function() {
    var deferred = async.defer();

    db.getAllAsync(cartilla.model.Prestador.getMetadata(), 'especialidad')
      .then(function (especialidades) {
         var values = [];
         var result = [];

         for(var i = 0; i < especialidades.length; i++) {
          var especialidad = especialidades[i].especialidad.trim();

          if(especialidad.includes(',')) {
            var splitted = especialidad.split(',');

            for(var j = 0; j < splitted.length; j++) {
              especialidad = splitted[j].trim();

              if(values.indexOf(especialidad) == -1) {
                values.push(especialidad);
                result.push(new cartilla.model.Especialidad(especialidad));
              }
            }
          } else {
            if(values.indexOf(especialidad) == -1) {
              values.push(especialidad);
              result.push(new cartilla.model.Especialidad(especialidad));
            }
          }
         }

         deferred.resolve(result);
      }, function (error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getProvinciasAsync = function(especialidad) {
    var deferred = async.defer();

    if(especialidad && especialidad !== '') {
      db.getAllWhereAsync(cartilla.model.Prestador.getMetadata(), { especialidad : especialidad }, 'zona')
        .then(function (zonas) {
           var result = [];

           for(var i = 0; i < zonas.length; i++) {
             result.push(new cartilla.model.Provincia(zonas[i].zona));
           }

           deferred.resolve(result);
        }, function (error) {
           deferred.reject(new cartilla.exceptions.DataException(error));
        });
    } else {
      db.getAllAsync(cartilla.model.Prestador.getMetadata(), 'zona')
        .then(function (zonas) {
           var result = [];

           for(var i = 0; i < zonas.length; i++) {
             result.push(new cartilla.model.Provincia(zonas[i].zona));
           }

           deferred.resolve(result);
        }, function (error) {
           deferred.reject(new cartilla.exceptions.DataException(error));
        });
    }

    return deferred.promise;
  };

  constructor.prototype.getLocalidadesAsync = function(provincia) {
    var deferred = async.defer();

    if(provincia && provincia !== '') {
      db.getAllWhereAsync(cartilla.model.Prestador.getMetadata(), { zona: provincia }, 'localidad')
        .then(function (localidades) {
           var result = [];

           for(var i = 0; i < localidades.length; i++) {
             result.push(new cartilla.model.Localidad(localidades[i].localidad));
           }

           deferred.resolve(result);
        }, function (error) {
           deferred.reject(new cartilla.exceptions.DataException(error));
        });
    } else {
      db.getAllAsync(cartilla.model.Prestador.getMetadata(), 'localidad')
        .then(function (localidades) {
           var result = [];

           for(var i = 0; i < localidades.length; i++) {
             result.push(new cartilla.model.Localidad(localidades[i].localidad));
           }

           deferred.resolve(result);
        }, function (error) {
           deferred.reject(new cartilla.exceptions.DataException(error));
        });
    }

    return deferred.promise;
  };

  constructor.prototype.getPrestadoresAsync = function() {
    var deferred = async.defer();

    db.getAllAsync(cartilla.model.Prestador.getMetadata())
      .then(function (prestadores){
         var result = [];

         for(var i = 0; i < prestadores.length; i++) {
           result.push(new cartilla.model.Prestador(prestadores[i]));
         }

         deferred.resolve(result);
      }, function (error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getPrestadoresByAsync = function(criteria) {
    var deferred = async.defer();
    var query = 'SELECT * FROM ' + cartilla.model.Prestador.getMetadata().name + ' WHERE 1 = 1 ';
    var values = [];

    if (criteria.especialidad) {
      query += ' AND especialidad LIKE ?'
      values.push('%' + criteria.especialidad + '%');
    }

    if (criteria.zona) {
      query += ' AND zona = ?'
      values.push(criteria.zona);
    }

    if (criteria.localidad) {
      query += ' AND localidad = ?'
      values.push(criteria.localidad);
    }

    db.getByQueryAsync(query, values)
      .then(function (prestadores) {
        var result = [];

        for (var i = 0; i < prestadores.length; i++) {
          result.push(new cartilla.model.Prestador(prestadores[i]));
        }

        deferred.resolve(result);
      }, function (error) {
        deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getPrestadorByAsync = function(criteria) {
    var deferred = async.defer();

    db.getFirstWhereAsync(cartilla.model.Prestador.getMetadata(), criteria)
      .then(function (prestador){
         deferred.resolve(new cartilla.model.Prestador(prestador));
      }, function (error) {
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
      .then(function (deleted) {
        if(deleted) {
          var prestadores = [];

          for(var i = 0; i < cartillaData.length; i++) {
            prestadores.push(cartillaData[i].prestadorTO);
          }

          db.createAsync(cartilla.model.Prestador.getMetadata(), prestadores)
            .then(function (result) {
              deferred.resolve(result);
            }, function (error) {
              deferred.reject(new cartilla.exceptions.DataException(error));
            });
        } else {
          deferred.resolve(false);
        }
      }, function (error) {
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
     new cartilla.model.Especialidad('Odontología'),
     new cartilla.model.Especialidad('Pediatría'),
     new cartilla.model.Especialidad('Traumatología'),
     new cartilla.model.Especialidad('LABORATORIO DE ANÁLISIS CLÍNICO')
   ];
  };
  var getLocalidades =  function() {
    return [
     new cartilla.model.Localidad('Santos Lugares'),
     new cartilla.model.Localidad('Devoto'),
     new cartilla.model.Localidad('Paso de Los Libres')
    ];
  };
  var getProvincias = function() {
   return [
     new cartilla.model.Provincia('Buenos Aires'),
     new cartilla.model.Provincia('Corrientes'),
     new cartilla.model.Provincia('Capital Federal')
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

  constructor.prototype.initialize = function() {
    var deferred = async.defer();

    deferred.resolve(true);

    return deferred.promise;
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

  constructor.prototype.getPrestadoresByAsync = function(criteria) {
    var deferred = async.defer();

    deferred.resolve(getPrestadores());

    return deferred.promise;
  };

  constructor.prototype.getPrestadorByAsync = function(criteria) {
    var deferred = async.defer();

    deferred.resolve(getPrestadores()[0]);

    return deferred.promise;
  };

  constructor.prototype.actualizarCartillaAsync = function(cartillaData) {
  };

  return constructor;
}());
