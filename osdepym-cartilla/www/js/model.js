cartilla.namespace('cartilla.model.Afiliado');

cartilla.model.Afiliado = function(dni, telefono, sexo) {
  if(!(this instanceof cartilla.model.Afiliado)) {
    return new cartilla.model.Afiliado(dni, telefono, sexo);
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

cartilla.model.Prestador = function(nombre, especialidad, domicilio, localidad, provincia, cp, telefono, coordenadas) {
  if(!(this instanceof cartilla.model.Prestador)) {
    return new cartilla.model.Prestador(nombre, especialidad, domicilio, localidad, provincia, cp, telefono, coordenadas);
  }

  return {
    getNombre: function() {
      return nombre;
    },
    getEspecialidad: function() {
      return especialidad;
    },
    getDomicilio: function() {
      return domicilio;
    },
    getLocalidad: function() {
      return localidad;
    },
    getProvincia: function() {
      return provincia;
    },
    getCP: function() {
      return cp;
    },
    getTelefono: function() {
      return telefono;
    },
    getCoordenadas: function() {
      return coordenadas;
    }
  };
};
