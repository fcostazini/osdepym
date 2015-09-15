OSDEPYM.namespace("OSDEPYM.services.DataService");

OSDEPYM.services.DataService = (function(configuration) {
  var isInZone = function(prestador) {
    var currentCoordinates = "";

    //TODO: Code this method base on current coordinates and radium
  };

  var constructor = function(dataProvider) {
    this.dataProvider = dataProvider;
  };

  constructor.prototype.getAfiliado = function(dni) {
    var afiliados = this.dataProvider.getAfiliados();
    var max;

    for(var i = 0; max = afiliados.length; i += 1) {
      if(afiliados[i].getDNI() === dni) {
        return afiliados[i];
      }
    }

    return null;
  };

  constructor.prototype.getEspecialidades = function() {
    return this.dataProvider.getEspecialidades();
  };

  constructor.prototype.getLocalidades = function() {
    return this.dataProvider.getLocalidades();
  };

  constructor.prototype.getProvincias = function() {
    return this.dataProvider.getProvincias();
  };

  constructor.prototype.getPrestadoresByEspecialidad = function(especialidad, localidad, provincia) {
    var prestadores = this.dataProvider.getPrestadores();
    var max;
    var result = [];
    var j = 0;

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
        result[j] = prestadores[i];
        j += 1;
      }
    }

    return result;
  };

  constructor.prototype.getPrestadoresByNombre = function(nombre) {
    var prestadores = this.dataProvider.getPrestadores();
    var max;
    var result = [];
    var j = 0;

    for(var i = 0; max = prestadores.length; i += 1) {
      if(prestadores[i].getNombre() === nombre) {
        result[j] = prestadores[i];
        j += 1;
      }
    }

    return result;
  };

  constructor.prototype.getPrestadoresByCercania = function(especialidad) {
    var prestadores = this.dataProvider.getPrestadores();
    var max;
    var result = [];
    var j = 0;

    for(var i = 0; max = prestadores.length; i += 1) {
      if(prestadores[i].getEspecialidad() === especialidad && isInZone(prestadores[i])) {
        result[j] = prestadores[i];
        j += 1;
      }
    }

    return result;
  };

  return constructor;
}(OSDEPYM.configuration));

