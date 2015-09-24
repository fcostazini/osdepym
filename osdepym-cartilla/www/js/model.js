var model = angular.module('model', []);

model.factory('busquedaActual', function() {
  var prestadores = [];
  var prestadorActual;
  var tipoBusqueda = "";

  return {
    getPrestadores: function() {
      return this.prestadores;
    },
    setPrestadores: function(prestadores) {
      this.prestadores = prestadores;
    },
    seleccionarPrestador: function(prestador) {
      this.prestadorActual = prestador;
    },
    getPrestadorActual: function() {
      return this.prestadorActual;
    },
    getTipoBusqueda: function(){
      return this.tipoBusqueda;
    },
    setTipoBusqueda: function(tipoBusqueda){
      this.tipoBusqueda = tipoBusqueda;
    }
  };
});

cartilla.namespace('cartilla.model.Afiliado');

cartilla.model.Afiliado = function(dataObject) {
  if(!(this instanceof cartilla.model.Afiliado)) {
    return new cartilla.model.Afiliado(dataObject);
  }

  return {
    getNombre: function() {
      return dataObject.nombre;
    },
    getDNI: function() {
      return dataObject.dni;
    },
    getCUIL: function() {
      return dataObject.cuil;
    },
    getSexo: function() {
      return dataObject.sexo;
    },
    getPlan: function() {
      return dataObject.plan;
    }
  };
};

cartilla.model.Afiliado.getMetadata = function() {
	return {
		name: 'afiliados',
		attributes: [
			{ name: 'nombre', type: 'TEXT' },
			{ name: 'dni', type: 'INTEGER PRIMARY KEY' },
			{ name: 'cuil', type: 'INTEGER' },
			{ name: 'sexo', type: 'TEXT' },
			{ name: 'plan', type: 'TEXT' },
		]
	};
};

cartilla.namespace('cartilla.model.Especialidad');

cartilla.model.Especialidad = function(dataObject) {
  if(!(this instanceof cartilla.model.Especialidad)) {
    return new cartilla.model.Especialidad(dataObject);
  }

  return {
    getNombre: function() {
      return dataObject.nombre;
    }
  };
};

cartilla.model.Especialidad.getMetadata = function() {
	return {
		name: 'especialidades',
		attributes: [
			{ name: 'nombre', type: 'TEXT PRIMARY KEY' }
		]
	};
};

cartilla.namespace('cartilla.model.Localidad');

cartilla.model.Localidad = function(dataObject) {
  if(!(this instanceof cartilla.model.Localidad)) {
    return new cartilla.model.Localidad(dataObject);
  }

  return {
    getNombre: function() {
      return dataObject.nombre;
    }
  };
};

cartilla.model.Localidad.getMetadata = function() {
	return {
		name: 'localidades',
		attributes: [
			{ name: 'nombre', type: 'TEXT PRIMARY KEY' }
		]
	};
};

cartilla.namespace('cartilla.model.Provincia');

cartilla.model.Provincia = function(dataObject) {
  if(!(this instanceof cartilla.model.Provincia)) {
    return new cartilla.model.Provincia(dataObject);
  }

  return {
    getNombre: function() {
      return dataObject.nombre;
    }
  };
};

cartilla.model.Provincia.getMetadata = function() {
	return {
		name: 'provincias',
		attributes: [
			{ name: 'nombre', type: 'TEXT PRIMARY KEY' }
		]
	};
};

cartilla.namespace('cartilla.model.Prestador');

cartilla.model.Prestador = function(dataObject) {
  if(!(this instanceof cartilla.model.Prestador)) {
    return new cartilla.model.Prestador(dataObject);
  }

  return {
    getId: function(){
      return dataObject.id;
    },
    getNombre: function() {
      return dataObject.nombre;
    },
    getEspecialidad: function() {
      return dataObject.especialidad;
    },
    getCalle: function() {
      return dataObject.calle;
    },
    getNumeroCalle: function() {
      return dataObject.numeroCalle;
    },
    getPiso: function() {
      return dataObject.piso;
    },
    getDepartamento: function() {
      return dataObject.departamento;
    },
    getLocalidad: function() {
      return dataObject.localidad;
    },
    getZona: function() {
      return dataObject.zona;
    },
    getCodigoPostal: function() {
      return dataObject.codigoPostal;
    },
    getCoordenadas: function() {
      return {
        latitud: dataObject.latitud,
        longitud: dataObject.longitud
      };
    },
    getTelefonos: function() {
      return dataObject.telefonos.split(',');
    },
    getHorarios: function() {
      return dataObject.horarios.split(',');
    },
    getDireccion: function(){
      var direccion = dataObject.calle + " " + dataObject.numeroCalle + " " ;

      if(dataObject.piso != ''){
        direccion += dataObject.piso;
      }

      if(dataObject.departamento != ''){
        direccion += dataObject.departamento;
      }

      if(dataObject.zona != ''){
        direccion += ", " + dataObject.zona;
      }

      if(dataObject.localidad != ''){
        direccion += ", " + dataObject.localidad;
      }

      return direccion;
    }
  };
};

cartilla.model.Prestador.getMetadata = function() {
	return {
		name: 'prestadores',
		attributes: [
			{ name: 'idBaseDeDatos', type: 'INTEGER PRIMARY KEY' },
			{ name: 'nombre', type: 'TEXT' },
			{ name: 'especialidad', type: 'TEXT' },
			{ name: 'calle', type: 'TEXT' },
			{ name: 'numeroCalle', type: 'INTEGER' },
			{ name: 'piso', type: 'TEXT' },
			{ name: 'departamento', type: 'TEXT' },
			{ name: 'localidad', type: 'TEXT' },
			{ name: 'zona', type: 'TEXT' },
			{ name: 'codigoPostal', type: 'INTEGER' },
			{ name: 'latitud', type: 'INTEGER' },
			{ name: 'longitud', type: 'INTEGER' },
			{ name: 'telefonos', type: 'TEXT' },
			{ name: 'horarios', type: 'TEXT' },
		]
	};
};
