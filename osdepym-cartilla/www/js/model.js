var model = angular.module('model', []);

model.factory('busquedaActual', function() {
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

cartilla.namespace('cartilla.model.Afiliado');

cartilla.model.Afiliado = function(nombre, dni, cuil, sexo, plan) {
  if(!(this instanceof cartilla.model.Afiliado)) {
    return new cartilla.model.Afiliado(nombre, dni, cuil, sexo, plan);
  }

  return {
    getNombre: function() {
      return nombre;
    },
    getDNI: function() {
      return dni;
    },
    getCUIL: function() {
      return cuil;
    },
    getSexo: function() {
      return sexo;
    },
    getPlan: function() {
      return plan;
    }
  };
};

cartilla.model.Afiliado.getMetadata = function() {
	return {
		name: 'afiliados',
		attributes: [
			{ name: 'nombre', type: 'TEXT' },
			{ name: 'dni', type: 'INTEGER' },
			{ name: 'cuil', type: 'INTEGER' },
			{ name: 'sexo', type: 'TEXT' },
			{ name: 'plan', type: 'TEXT' },
		]
	};
};

cartilla.namespace('cartilla.model.Especialidad');

cartilla.model.Especialidad = function(nombre) {
  if(!(this instanceof cartilla.model.Especialidad)) {
    return new cartilla.model.Especialidad(nombre);
  }

  return {
    getNombre: function() {
      return nombre;
    }
  };
};

cartilla.model.Especialidad.getMetadata = function() {
	return {
		name: 'especialidades',
		attributes: [
			{ name: 'nombre', type: 'TEXT' }
		]
	};
};

cartilla.namespace('cartilla.model.Localidad');

cartilla.model.Localidad = function(nombre) {
  if(!(this instanceof cartilla.model.Localidad)) {
    return new cartilla.model.Localidad(nombre);
  }

  return {
    getNombre: function() {
      return nombre;
    }
  };
};

cartilla.model.Localidad.getMetadata = function() {
	return {
		name: 'localidades',
		attributes: [
			{ name: 'nombre', type: 'TEXT' }
		]
	};
};

cartilla.namespace('cartilla.model.Provincia');

cartilla.model.Provincia = function(nombre) {
  if(!(this instanceof cartilla.model.Provincia)) {
    return new cartilla.model.Provincia(nombre);
  }

  return {
    getNombre: function() {
      return nombre;
    }
  };
};

cartilla.model.Provincia.getMetadata = function() {
	return {
		name: 'provincias',
		attributes: [
			{ name: 'nombre', type: 'TEXT' }
		]
	};
};

cartilla.namespace('cartilla.model.Prestador');

cartilla.model.Prestador = function(id, nombre, especialidad, calle, numeroCalle, piso, departamento, localidad, zona, codigoPostal, latitud, longitud, telefonos, horarios) {
  if(!(this instanceof cartilla.model.Prestador)) {
    return new cartilla.model.Prestador(id, nombre, especialidad, calle, numeroCalle, piso, departamento, localidad, zona, codigoPostal, latitud, longitud, telefonos, horarios);
  }

  return {
    getId: function(){
      return id;
    },
    getNombre: function() {
      return nombre;
    },
    getEspecialidad: function() {
      return especialidad;
    },
    getCalle: function() {
      return calle;
    },
    getNumeroCalle: function() {
      return numeroCalle;
    },
    getPiso: function() {
      return piso;
    },
    getDepartamento: function() {
      return departamento;
    },
    getLocalidad: function() {
      return localidad;
    },
    getZona: function() {
      return zona;
    },
    getCodigoPostal: function() {
      return codigoPostal;
    },
    getLatitud: function() {
      return latitud;
    },
    getLongitud: function() {
      return longitud;
    },
    getTelefonos: function() {
      return telefonos;
    },
    getHorarios: function() {
      return horarios;
    }
  };
};

cartilla.model.Prestador.getMetadata = function() {
	return {
		name: "prestadores",
		attributes: [
			{ name: 'idBaseDeDatos', type: 'INTEGER' },
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
