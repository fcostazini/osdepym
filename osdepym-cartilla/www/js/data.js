var data = angular.module('data', ['setup', 'ngCordova']);

data.factory('dataProvider', function($cordovaSQLite, $q, $http, configuration) {
  var dataProvider;

  if(configuration.useDataBase) {
    var dataBase = new cartilla.data.SQLiteDataBase($cordovaSQLite, $q, configuration);

    dataProvider = new cartilla.data.DataBaseDataProvider(dataBase, $http);
  } else {
    dataProvider = new cartilla.data.StaticDataProvider();
  }

  return dataProvider;
});

cartilla.namespace('cartilla.data.SQLiteDataBase');

cartilla.data.SQLiteDataBase = (function() {
  var sqlite;
  var q;
  var db;

  var constructor = function($sqlite, $q, configuration) {
    sqlite = $sqlite;
    q = $q;
    db = sqlite.openDB({ name: configuration.dbName });
  };

  var query = function (script, parameters) {
    var params = parameters || [];
    var deferred = q.defer();

    sqlite.execute(db, script, parameters)
      .then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        //TODO: Error handling
        deferred.reject(error);
      });

    return deferred.promise;
  };

  var isValidObject = function(metadata, object) {
    for(var i = 0; i < metadata.attributes.length; i ++) {
      if(object[metadata.attributes[i].name] === undefined) {
        return false;
      }
    }

    return true;
  };

  constructor.prototype.getAll = function(metadata) {
    var script = 'SELECT * FROM ' + metadata.name;

    return query(script)
        .then(function(result) {
          var output = [];

          for (var i = 0; i < result.rows.length; i++) {
           output.push(result.rows.item(i));
          }

          return output;
        });
  };

  constructor.prototype.getAllWhere = function(metadata, attribute, value) {
    var script = 'SELECT * FROM ' + metadata.name + ' WHERE ' + attribute + ' = ?';

    return query(script, [ value ])
        .then(function(result) {
          var output = [];

          for (var i = 0; i < result.rows.length; i++) {
           output.push(result.rows.item(i));
          }

          return output;
        });
  };

  constructor.prototype.getFirstWhere = function(metadata, attribute, value) {
    var script = 'SELECT * FROM ' + metadata.name + ' WHERE ' + attribute + ' = ? LIMIT 1';

    return query(script, [ value ])
        .then(function(result) {
          return result.rows.item(0);
        });
  };

  constructor.prototype.any = function(metadata) {
    var script = 'SELECT * FROM ' + metadata.name;

    return query(script)
        .then(function(result) {
          return result && result.length > 0;
        });
  };

  constructor.prototype.create = function(metadata, object) {
    if(!isValidObject(metadata, object)) {
      //TODO: Log error or throw exception
      return;
    }

    var script = 'INSERT INTO ' + metadata.name + ' (';

    //TODO: Optimize for loops to be only one instead of three

    for(var i = 0; i < metadata.attributes.length; i ++) {
      script += i == metadata.attribute.length - 1 ?
        metadata.attributes[i].name + ')' :
        metadata.attributes[i].name + ', ';
    }

    script += ' VALUES (';

    for(var i = 0; i < metadata.attributes.length; i ++) {
      script += i == metadata.attribute.length - 1 ? '?)' : '?, ';
    }

    var values = [];

    for(var i = 0; i < metadata.attributes.length; i ++) {
      var value = object[metadata.attributes[i].name];

      if(Array.isArray(value)) {
        value = value.join();
      }

      values.push(value);
    }

    query(script, values)
      .then(function(result) {
        //TODO: What we should do here?
      });
  };

  return constructor;
}());

cartilla.namespace('cartilla.data.StaticDataProvider');

cartilla.data.StaticDataProvider = (function() {
  var afiliados = [
    new cartilla.model.Afiliado({nombre: 'Afiliado prueba 1', dni: 31372955, cuil: 20313729550, sexo: 'M', plan: 'Plata'}),
    new cartilla.model.Afiliado({nombre: 'Afiliado prueba 2', dni: 31117665, cuil: 20311176650, sexo: 'M', plan: 'Dorado'}),
    new cartilla.model.Afiliado({nombre: 'Afiliado prueba 3', dni: 30332445, cuil: 20303324450, sexo: 'F', plan: 'Bronce'})
  ];
  var especialidades = [
    new cartilla.model.Especialidad({nombre: 'Odontología'}),
    new cartilla.model.Especialidad({nombre: 'Pediatría'}),
    new cartilla.model.Especialidad({nombre: 'Traumatología'}),
    new cartilla.model.Especialidad({nombre: 'LABORATORIO DE ANÁLISIS CLÍNIC'})
  ];
  var localidades = [
    new cartilla.model.Localidad({nombre: 'Santos Lugares'}),
    new cartilla.model.Localidad({nombre: 'Devoto'}),
    new cartilla.model.Localidad({nombre: 'Paso de Los Libres'})
  ];
  var provincias = [
    new cartilla.model.Provincia({nombre: 'Buenos Aires'}),
    new cartilla.model.Provincia({nombre: 'Corrientes'})
  ];
  var prestadores = [
    new cartilla.model.Prestador({id: 1, nombre: 'Mauro Agnoletti', especialidad: 'LABORATORIO DE ANÁLISIS CLÍNIC', calle: 'AGUERO', numeroCalle: 1425, piso: 1, departamento: 'A', localidad: 'RECOLETA', zona: 'CAPITAL FEDERAL', codigoPostal: 555, latitud: -34.595140, longitud: -58.409447, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
    new cartilla.model.Prestador({id: 2, nombre: 'Facundo Costa Zini', especialidad: 'Odontología', calle: 'AV PTE H YRIGOYEN', numeroCalle: 1832, piso: 3, departamento: 'B', localidad: 'LOMAS DE ZAMORA', zona: 'GBA SUR', codigoPostal: 9221, latitud: -34.763066, longitud: -58.403225, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'}),
    new cartilla.model.Prestador({id: 3, nombre: 'Dario Camarro', especialidad: 'LABORATORIO DE ANÁLISIS CLÍNIC', calle: 'AV B RIVADAVIA', numeroCalle: 1424, piso: 8, departamento: '', localidad: 'CABALLITO', zona: 'CAPITAL FEDERAL', codigoPostal: 5170, latitud: -34.619247, longitud: -58.438518, telefonos: '(  54)( 011)  46431093, (  54)( 011)  46444903', horarios: 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'})
  ];

  var constructor = function() { };

  constructor.prototype.getAfiliados = function() {
    return afiliados;
  };

  constructor.prototype.getAfiliadoBy = function(attribute, value) {
    return afiliados[0];
  };

  constructor.prototype.getEspecialidades = function() {
      return especialidades;
  };

  constructor.prototype.getProvincias = function() {
    return provincias;
  };

  constructor.prototype.getLocalidades = function() {
    return localidades;
  };

  constructor.prototype.getPrestadores = function() {
    return prestadores;
  };

  constructor.prototype.getPrestadores = function(attribute, value) {
    return prestadores;
  };

  constructor.prototype.getPrestadorBy = function(attribute, value) {
    return prestadores[0];
  };

  constructor.prototype.updateData = function() {
  };

  return constructor;
}());

cartilla.namespace('cartilla.data.DataBaseDataProvider');

cartilla.data.DataBaseDataProvider = (function() {
  var db;
  var httpService;

  var constructor = function(database, $httpService) {
    db = database;
    httpService = $httpService;
  };

  constructor.prototype.getAfiliados = function() {
    return db
      .getAll(cartilla.model.Afiliado.getMetadata())
      .then(function(afiliados){
        var result = [];

        for(var i = 0; i < afiliados.length; i++) {
          result.push(new cartilla.model.Afiliado(afiliados[i]));
        }

        return result;
      });
  };

  constructor.prototype.getAfiliadoBy = function(attribute, value) {
    return db
      .getFirstWhere(cartilla.model.Afiliado.getMetadata(), attribute, value)
      .then(function(afiliado){
        return new cartilla.model.Afiliado(afiliado);
      });
  };

  constructor.prototype.getEspecialidades = function() {
    return db
      .getAll(cartilla.model.Especialidad.getMetadata())
      .then(function(especialidades){
         var result = [];

         for(var i = 0; i < especialidades.length; i++) {
           result.push(new cartilla.model.Especialidad(especialidades[i]));
         }

         return result;
      });
  };

  constructor.prototype.getProvincias = function() {
    return db
      .getAll(cartilla.model.Provincia.getMetadata())
      .then(function(provincias){
        var result = [];

        for(var i = 0; i < provincias.length; i++) {
          result.push(new cartilla.model.Provincia(provincias[i]));
        }

        return result;
      });
  };

  constructor.prototype.getLocalidades = function() {
    return db
      .getAll(cartilla.model.Localidad.getMetadata())
      .then(function(localidades){
         var result = [];

         for(var i = 0; i < localidades.length; i++) {
           result.push(new cartilla.model.Localidad(localidades[i]));
         }

         return result;
      });
  };

  constructor.prototype.getPrestadores = function() {
    return db
      .getAll(cartilla.model.Prestador.getMetadata())
      .then(function(prestadores){
         var result = [];

         for(var i = 0; i < prestadores.length; i++) {
           result.push(new cartilla.model.Prestador(prestadores[i]));
         }

         return result;
      });
  };

  constructor.prototype.getPrestadores = function(attribute, value) {
    return db
      .getAllWhere(cartilla.model.Prestador.getMetadata(), attribute, value)
      .then(function(prestadores){
         var result = [];

         for(var i = 0; i < prestadores.length; i++) {
           result.push(new cartilla.model.Prestador(prestadores[i]));
         }

         return result;
      });
  };

  constructor.prototype.getPrestadorBy = function(attribute, value) {
    return db
      .getFirstWhere(cartilla.model.Prestador.getMetadata(), attribute, value)
      .then(function(prestador){
         return new cartilla.model.Prestador(prestador);
      });
  };

  constructor.prototype.updateData = function(dni, sexo) {
    if(!db.any(cartilla.model.Especialidad.getMetadata())) {
      //TODO: Add logic to read Especialidades from txt and create on DB.
    }

    if(!db.any(cartilla.model.Localidad.getMetadata())) {
      //TODO: Add logic to read Localidades from txt and create on DB.
    }

    if(!db.any(cartilla.model.Provincia.getMetadata())) {
      //TODO: Add logic to read Provincias from txt and create on DB.
    }

    $http.get(configuration.serviceUrls.getPrestadores.replace('<dni>', dni).replace('<sexo>', sexo))
       .then(function(response) {
            var prestadores = response.data;

            for(var i = 0; i < prestadores.length; i ++) {
              db.create(cartilla.model.Prestador.getMetadata(), prestadores[i].prestadorTO);
            }
       }, function(err) {
          //TODO: Error handling
       });
  };

  return constructor;
}());
