cartilla.namespace('cartilla.exceptions.DataException');

cartilla.exceptions.DataException = (function() {
  var message = '';

  var constructor = function(msg) {
    if(!(this instanceof cartilla.exceptions.DataException)) {
      return new cartilla.exceptions.DataException(msg);
    }

    message = msg;
  };

  constructor.prototype.getName = function() {
    return 'DataException';
  };
  constructor.prototype.getMessage = function() {
    return message;
  };

  return constructor;
}());

cartilla.namespace('cartilla.exceptions.ServiceException');

cartilla.exceptions.ServiceException = (function() {
  var message = '';
  var innerException = {};

  var constructor = function(msg, inner) {
    if(!(this instanceof cartilla.exceptions.ServiceException)) {
      return new cartilla.exceptions.ServiceException(msg, inner);
    }

    message = msg;
    innerException = inner;
  };

  constructor.prototype.getName = function() {
    return 'ServiceException';
  };
  constructor.prototype.getMessage = function() {
    return message;
  };
  constructor.prototype.getInnerException = function() {
    return innerException;
  };

  return constructor;
}());

var exceptions = angular.module('exceptions', []);

exceptions.factory('errorHandler', function($log) {
  return {
    handle: function(error, title) {
      if(!error || error == '') {
        return '';
      }

      var message = '';

      if (error instanceof cartilla.exceptions.ServiceException) {
        message = error.getMessage();

        var innerException = error.getInnerException();

        if (innerException) {
          var innerMessage = innerException instanceof cartilla.exceptions.DataException ?
            innerException.getMessage() :
            innerException;

          message += ' - ' + innerMessage;
        }
      } else if (error instanceof cartilla.exceptions.DataException) {
          message = error.getMessage();
      } else if(error instanceof Error) {
        message = 'Ocurrio un error inesperado - ' + error.message;
      } else {
        message = 'Ocurrio un error inesperado - ' + error;
      }

      if(title && title != '') {
        message = title + ' - ' + message;
      }

      $log.error(message);
      alert(message);

      return message;
    }
  };
});
