var data = angular.module('data', ['setup', 'ngCordova']);

data.factory('dataProvider', function($cordovaSQLite, $q, configuration) {
  var dataProvider;

  if(configuration.useDataBase) {
    var dataBase = new cartilla.data.SQLiteDataBase($cordovaSQLite, $q, configuration);

    dataProvider = new cartilla.data.DataBaseDataProvider(dataBase);
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

  var query = function (query, parameters) {
    var params = parameters || [];
    var deferred = q.defer();

    sqlite.execute(db, query, parameters)
      .then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        //TODO: Error handling
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.getAll = function(metadata) {
    var query = 'SELECT * from ' + metadata.name;

    return query(query)
        .then(function(result) {
          var output = [];

          for (var i = 0; i < result.rows.length; i++) {
           output.push(result.rows.item(i));
          }

          return output;
        });
  };

  constructor.prototype.getAllWhere = function(metadata, attribute, value) {
    var query = 'SELECT * from ' + metadata.name + ' WHERE ' + attribute + ' = ?';

    return query(query, [ value ])
        .then(function(result) {
          var output = [];

          for (var i = 0; i < result.rows.length; i++) {
           output.push(result.rows.item(i));
          }

          return output;
        });
  };

  constructor.prototype.getFirstWhere = function(metadata, attribute, value) {
    var query = 'SELECT * from ' + metadata.name + ' WHERE ' + attribute + ' = ? LIMIT 1';

    return query(query, [ value ])
        .then(function(result) {
          return result.rows.item(0);
        });
  };

  return constructor;
}());

cartilla.namespace('cartilla.data.StaticDataProvider');

cartilla.data.StaticDataProvider = (function() {
  var afiliados = [
    new cartilla.model.Afiliado('Afiliado prueba 1', 31372955, 20313729550, 'M', 'Plata'),
    new cartilla.model.Afiliado('Afiliado prueba 2', 31117665, 20311176650, 'M', 'Dorado'),
    new cartilla.model.Afiliado('Afiliado prueba 3', 30332445, 20303324450, 'F', 'Bronce')
  ];
  var especialidades = [
    new cartilla.model.Especialidad('Odontología'),
    new cartilla.model.Especialidad('Pediatría'),
    new cartilla.model.Especialidad('Traumatología'),
    new cartilla.model.Especialidad('LABORATORIO DE ANÁLISIS CLÍNIC')
  ];
  var localidades = [
    new cartilla.model.Localidad('Santos Lugares'),
    new cartilla.model.Localidad('Devoto'),
    new cartilla.model.Localidad('Paso de Los Libres')
  ];
  var provincias = [
    new cartilla.model.Provincia('Buenos Aires'),
    new cartilla.model.Provincia('Corrientes')
  ];
  var prestadores = [
    new cartilla.model.Prestador(1, 'Mauro Agnoletti', 'LABORATORIO DE ANÁLISIS CLÍNIC', 'AGUERO', 1425, 1, 'A', 'RECOLETA', 'CAPITAL FEDERAL', 555, -34.595140, -58.409447, '(  54)( 011)  46431093, (  54)( 011)  46444903', 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'),
    new cartilla.model.Prestador(2, 'Facundo Costa Zini', 'Odontología', 'AV PTE H YRIGOYEN', 1832, 3, 'B', 'LOMAS DE ZAMORA', 'GBA SUR', 9221, -34.763066, -58.403225, '(  54)( 011)  46431093, (  54)( 011)  46444903', 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.'),
    new cartilla.model.Prestador(3, 'Dario Camarro', 'LABORATORIO DE ANÁLISIS CLÍNIC', 'AV B RIVADAVIA', 1424, 8, '', 'CABALLITO', 'CAPITAL FEDERAL', 5170, -34.619247, -58.438518, '(  54)( 011)  46431093, (  54)( 011)  46444903', 'Jueves de 12:00hs. a 20:00hs., Martes de 12:00hs. a 20:00hs.')
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

  return constructor;
}());

cartilla.namespace('cartilla.data.DataBaseDataProvider');

cartilla.data.DataBaseDataProvider = (function() {
  var db;

  var constructor = function(database) {
    db = database;
  };

  constructor.prototype.getAfiliados = function() {
    return db
      .getAll(cartilla.model.Afiliado.getMetadata())
      .then(function(result){
        //TODO: We need to convert the DB result to model objects
        return result;
      });
  };

  constructor.prototype.getAfiliadoBy = function(attribute, value) {
    return db
      .getFirstWhere(cartilla.model.Afiliado.getMetadata(), attribute, value)
      .then(function(result){
        //TODO: We need to convert the DB result to model objects
        return result;
      });
  };

  constructor.prototype.getEspecialidades = function() {
    return db
      .getAll(cartilla.model.Especialidad.getMetadata())
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return result;
      });
  };

  constructor.prototype.getProvincias = function() {
    return db
      .getAll(cartilla.model.Provincia.getMetadata())
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return result;
      });
  };

  constructor.prototype.getLocalidades = function() {
    return db
      .getAll(cartilla.model.Localidad.getMetadata())
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return result;
      });
  };

  constructor.prototype.getPrestadores = function() {
    return db
      .getAll(cartilla.model.Prestador.getMetadata())
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return result;
      });
  };

  constructor.prototype.getPrestadores = function(attribute, value) {
    return db
      .getAllWhere(cartilla.model.Prestador.getMetadata(), attribute, value)
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return result;
      });
  };

  constructor.prototype.getPrestadorBy = function(attribute, value) {
    return db
      .getFirstWhere(cartilla.model.Prestador.getMetadata(), attribute, value)
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return result;
      });
  };

  return constructor;
}());
