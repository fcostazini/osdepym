var OSDEPYM = OSDEPYM || {};

OSDEPYM.namespace = function(name) {
  var parts = name.split('.');
  var parent = OSDEPYM;
  var i;

  if(parts[0] === "OSDEPYM") {
    parts = parts.slice(1);
  }

  for(i = 0; i < parts.length; i += 1) {
    if(typeof parent[parts[i]] === "undefined") {
      parent[parts[i]] = {};
    }

    parent = parent[parts[i]];
  }

  return parent;
};

OSDEPYM.configuration = {
  useDataBase: false,
  searchRadiumInMeters: 1000
};

OSDEPYM.Cartilla = (function(configuration) {
  var instance;

  function initialize(data) {
    var dataProvider;

    if(configuration.useDataBase && data && data.sqlite && data.q) {
      var dataBase = new OSDEPYM.data.DataBase(data.sqlite, data.q);

      dataProvider = new OSDEPYM.data.DataBaseDataProvider(dataBase);
    } else {
      dataProvider = new OSDEPYM.data.StaticDataProvider();
    }

    return new OSDEPYM.services.DataService(dataProvider);
  };

  return {
      getInstance: function (data) {
        if (!instance) {
          instance = initialize(data);
        }

        return instance;
      }
  };
}(OSDEPYM.configuration));
