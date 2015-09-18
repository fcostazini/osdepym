cartilla.namespace('cartilla.model.Afiliado');

cartilla.model.Afiliado = function(nombre, dni, telefono, sexo, cui, plan) {
  if(!(this instanceof cartilla.model.Afiliado)) {
    return new cartilla.model.Afiliado(nombre, dni, telefono, sexo, cui, plan);
  }

  return {
    getDNI: function() {
      return dni;
    },
    getTelefono: function() {
      return telefono;
    },
    getSexo: function() {
      return sexo;
    },
    getCui: function() {
      return cui;
    },
    getNombre: function() {
      return nombre;
    },
    getPlan: function() {
     return plan;
    }
  };
}

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
}

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
}

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
}

cartilla.namespace('cartilla.model.Prestador');

cartilla.model.Prestador = function(idBaseDeDatos, nombre, calle, especialidad, codigoPostal, latitud, longitud, numeroCalle, piso, departamento, localidad, zona, telefono, horarios) {
  if(!(this instanceof cartilla.model.Prestador)) {
    return new cartilla.model.Prestador(idBaseDeDatos, nombre, calle, especialidad, codigoPostal, latitud, longitud, numeroCalle, piso, departamento, localidad, zona, telefonos, horarios);
  }

  return {
    gerIdBaseDeDatos: function(){
      return idBaseDeDatos;
    },
    getNombre: function() {
      return nombre;
    },
    getCalle: function() {
      return calle;
    },
    getEspecialidad: function() {
      return especialidad;
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

    getTelefonos: function() {
      return telefonos;
    },
    getHorarios: function() {
      return horarios;
    }
  };
};
