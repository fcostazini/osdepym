var data = angular.module('data', ['setup', 'ngCordova']);

data.factory('dataProvider', function($cordovaSQLite, $q, configuration) {
  var dataProvider;

  if(configuration.useDataBase) {
    var dataBase = new cartilla.data.DataBase($cordovaSQLite, $q);

    dataProvider = new cartilla.data.DataBaseDataProvider(dataBase);
  } else {
    dataProvider = new cartilla.data.StaticDataProvider();
  }

  return dataProvider;
});

cartilla.namespace('cartilla.data.DataBase');

cartilla.data.DataBase = (function() {
  var dbName = 'osdepym.db';
  var constructor = function(sqlite, q) {
    this.provider = sqlite;
    this.q = q;
    this.db = this.provider.openDB();
  };

  constructor.prototype.query = function (query, parameters) {
    var params = parameters || [];
    var deferred = this.q.defer();

    this.provider.execute(this.db, query, parameters)
      .then(function (result) {
        deferred.resolve(result);
      }, function (error) {
        //TODO: Error handling
        deferred.reject(error);
      });

    return deferred.promise;
  };

  constructor.prototype.getAll = function(result) {
    var output = [];

    for (var i = 0; i < result.rows.length; i++) {
     output.push(result.rows.item(i));
    }

    return output;
  };

  constructor.prototype.getFirst = function(result) {
    return result && result.rows ? result.rows.item(0) : null;
  };

  return constructor;
}());

cartilla.namespace('cartilla.data.StaticDataProvider');

cartilla.data.StaticDataProvider = (function() {
  var afiliados = [
    new cartilla.model.Afiliado('Afiliado prueba 1', '31372955', '1531236473', 'M', '20313729550', 'plata'),
    new cartilla.model.Afiliado('Afiliado prueba 2', '31117665', '1544332112', 'M', '20311176650', 'Dorado'),
    new cartilla.model.Afiliado('Afiliado prueba 3', '30332445', '1533231473', 'F', '20303324450', 'Bronce')
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
    new cartilla.model.Prestador('1','Mauro Agnoletti', 'AGUERO', 'LABORATORIO DE ANÁLISIS CLÍNIC', '1425', '-34.595140' ,'-58.409447', '555', 'Dpto. 2', 'RECOLETA', 'CAPITAL FEDERAL', ['(  54)( 011)  46431093', '(  54)( 011)  46444903'], ["Jueves de 12:00hs. a 20:00hs.","Martes de 12:00hs. a 20:00hs."]),
    new cartilla.model.Prestador('2','Facundo Costa Zini', 'AV PTE H YRIGOYEN', 'Odontología', '1832', '-34.763066' ,'-58.403225', '9221', 'Dpto. 2', 'LOMAS DE ZAMORA', 'GBA SUR', ['(  54)( 011)  46431093', '(  54)( 011)  46444903'], ["Jueves de 12:00hs. a 20:00hs.","Martes de 12:00hs. a 20:00hs."]),
    new cartilla.model.Prestador('3','Dario Camarro', 'AV B RIVADAVIA', 'LABORATORIO DE ANÁLISIS CLÍNIC', '1424', '-34.619247' ,'-58.438518', '5170', 'Dpto. B', 'CABALLITO', 'CAPITAL FEDERAL', ['(  54)( 011)  46431093', '(  54)( 011)  46444903'], ["Jueves de 12:00hs. a 20:00hs.","Martes de 12:00hs. a 20:00hs."])
  ];

  var constructor = function() { };

  constructor.prototype.getAfiliados = function() {
    return afiliados;
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

  return constructor;
}());

cartilla.namespace('cartilla.data.DataBaseDataProvider');

cartilla.data.DataBaseDataProvider = (function() {
  var constructor = function(database) {
    this.database = database;
  };

  constructor.prototype.getAfiliados = function() {
    return this.database
      .query('SELECT * FROM afiliados')
      .then(function(result){
        //TODO: We need to convert the DB result to model objects
        return this.database.getAll(result);
      });
  };

  constructor.prototype.getEspecialidades = function() {
    return this.database
      .query('SELECT * FROM especialidades')
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return this.database.getAll(result);
      });
  };

  constructor.prototype.getProvincias = function() {
    return this.database
      .query('SELECT * FROM provincias')
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return this.database.getAll(result);
      });
  };

  constructor.prototype.getLocalidades = function() {
    return this.database
      .query('SELECT * FROM localidades')
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return this.database.getAll(result);
      });
  };

  constructor.prototype.getPrestadores = function() {
    return this.database
      .query('SELECT * FROM prestadores')
      .then(function(result){
       //TODO: We need to convert the DB result to model objects
        return this.database.getAll(result);
      });
  };

  return constructor;
}());
