OSDEPYM.namespace("OSDEPYM.model.Afiliado");

OSDEPYM.model.Afiliado = function(dni, telefono, sexo) {
  if(!(this instanceof Afiliado)) {
    return new Afiliado(dni, telefono, sexo);
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

OSDEPYM.namespace("OSDEPYM.model.Especialidad");

OSDEPYM.model.Especialidad = function(nombre) {
  if(!(this instanceof Especialidad)) {
    return new Especialidad(nombre);
  }

  return {
    getNombre: function() {
      return nombre;
    }
  };
}

OSDEPYM.namespace("OSDEPYM.model.Localidad");

OSDEPYM.model.Localidad = function(nombre) {
  if(!(this instanceof Localidad)) {
    return new Localidad(nombre);
  }

  return {
    getNombre: function() {
      return nombre;
    }
  };
}

OSDEPYM.namespace("OSDEPYM.model.Provincia");

OSDEPYM.model.Provincia = function(nombre) {
  if(!(this instanceof Provincia)) {
    return new Provincia(nombre);
  }

  return {
    getNombre: function() {
      return nombre;
    }
  };
}

OSDEPYM.namespace("OSDEPYM.model.Prestador");

OSDEPYM.model.Prestador = function(nombre, especialidad, domicilio, localidad, provincia, cp, telefono, coordenadas) {
  if(!(this instanceof Prestador)) {
    return new Prestador(nombre, especialidad, domicilio, localidad, provincia, cp, telefono, coordenadas);
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
