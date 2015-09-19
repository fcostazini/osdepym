var setup = angular.module('setup', []);

setup.factory('configuration', function() {
  return {
    useDataBase: false,
	  dbName: '',
    searchRadiumInMeters: 1000,
    serviceUrls: {
      getAfiliado: 'http://www.osdepym.com.ar:8080/OSDEPYM_CartillaWeb2/rest/mobile/getAfiliado?dni=<dni>&sexo=<sexo>'
    }
  };
});

var cartilla = cartilla || {};

cartilla.namespace = function(name) {
  var parts = name.split('.');
  var parent = cartilla;
  var i;

  if(parts[0] === 'cartilla') {
    parts = parts.slice(1);
  }

  for(i = 0; i < parts.length; i += 1) {
    if(typeof parent[parts[i]] === 'undefined') {
      parent[parts[i]] = {};
    }

    parent = parent[parts[i]];
  }

  return parent;
};
