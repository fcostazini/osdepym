var data = angular.module('data', ['setup', 'ngCordova']);

data.factory('dataProvider', function($cordovaSQLite, $q, configuration) {
  var dataProvider;

  if(configuration.useDataBase) {
    var dataBase = new cartilla.data.SQLiteDataBase($cordovaSQLite, $q, configuration);
    dataProvider = new cartilla.data.DataBaseDataProvider(dataBase, $q);
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

    initialize(cartilla.model.Afiliado.getMetadata());
    initialize(cartilla.model.Especialidad.getMetadata());
    initialize(cartilla.model.Localidad.getMetadata());
    initialize(cartilla.model.Provincia.getMetadata());
    initialize(cartilla.model.Prestador.getMetadata());
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
        var metaAttibute = metadata.attributes[i];
        if(metaAttibute.name == attribute){
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
      if(!object.hasOwnProperty(metadata.attributes[i].name)) {
        continue;
      }

      fieldsText += i == metadata.attributes.length - 1 ?
        metadata.attributes[i].name + ')' :
        metadata.attributes[i].name + ', ';

      valuesText += i == metadata.attributes.length - 1 ? '?)' : '?, ';

      var value = object[metadata.attributes[i].name];

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
  var db;
  var async;

  var constructor = function(database, $q) {
    db = database;
    async = $q;
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

    db.getAllAsync(cartilla.model.Especialidad.getMetadata())
      .then(function onSuccess(especialidades){
         var result = [];

         for(var i = 0; i < especialidades.length; i++) {
           result.push(new cartilla.model.Especialidad(especialidades[i]));
         }

         deferred.resolve(result);
      }, function onError(error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getProvinciasAsync = function() {
    var deferred = async.defer();

    db.getAllAsync(cartilla.model.Provincia.getMetadata())
      .then(function onSuccess(provincias){
        var result = [];

        for(var i = 0; i < provincias.length; i++) {
          result.push(new cartilla.model.Provincia(provincias[i]));
        }

        deferred.resolve(result);
      }, function onError(error) {
         deferred.reject(new cartilla.exceptions.DataException(error));
      });

    return deferred.promise;
  };

  constructor.prototype.getLocalidadesAsync = function() {
    var deferred = async.defer();

    db.getAllAsync(cartilla.model.Localidad.getMetadata())
      .then(function onSuccess(localidades){
         var result = [];

         for(var i = 0; i < localidades.length; i++) {
           result.push(new cartilla.model.Localidad(localidades[i]));
         }

         deferred.resolve(result);
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

  constructor.prototype.getPrestadoresAsync = function(attribute, value) {
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

  constructor.prototype.updateDataAsync = function(cartillaData) {
    var deferred = async.defer();
    var updated = 0;

    //TODO: Add logic to read Especialidades, Localidades and Provincias from txt and create on DB.

    for(var i = 0; i < cartillaData.length; i ++) {
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
      new cartilla.model.Prestador({id: 2, nombre: 'Facundo Costa Zini', especialidad: 'Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
      new cartilla.model.Prestador({id: 3, nombre: 'Dario Camarro', especialidad: 'LABORATORIO DE ANÁLISIS CLÍNIC', calle: 'AV B RIVADAVIA', numeroCalle: 1424, piso: 8, departamento: '', localidad: 'CABALLITO', zona: 'CAPITAL FEDERAL', codigoPostal: 5170, latitud: -34.619247, longitud: -58.438518, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
      new cartilla.model.Prestador({id: 4, nombre: 'Facundo Costa Zini', especialidad: 'Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
      new cartilla.model.Prestador({id: 5, nombre: 'Facundo Costa Zini', especialidad: 'Odontología, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontología, OdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontología, OdontologíaOdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología, OdontologíaOdontologíaOdontologíaOdontología, Odontología, Odontología, Odontología, Odontología, Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'})
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
      nombre: afiliado.getNombre(),
      dni: afiliado.getDNI(),
      cuil: afiliado.getCUIL(),
      sexo: afiliado.getSexo(),
      plan: afiliado.getPlan()
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

  constructor.prototype.getPrestadoresAsync = function(attribute, value) {
    var deferred = async.defer();

    deferred.resolve(getPrestadores());

    return deferred.promise;
  };

  constructor.prototype.getPrestadorByAsync = function(attribute, value) {
    var deferred = async.defer();

    deferred.resolve(getPrestadores()[0]);

    return deferred.promise;
  };

  constructor.prototype.updateDataAsync = function() {
  };

  return constructor;
}());
