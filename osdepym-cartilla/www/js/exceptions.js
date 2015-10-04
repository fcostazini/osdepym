cartilla.namespace('cartilla.exceptions.DataException');

cartilla.exceptions.DataException = function(message) {
  if(!(this instanceof cartilla.exceptions.DataException)) {
    return new cartilla.exceptions.DataException(message);
  }

  return {
    getMessage: function() {
      return message;
    }
  };
};

cartilla.namespace('cartilla.exceptions.ServiceException');

cartilla.exceptions.ServiceException = function(message, innerException) {
  if(!(this instanceof cartilla.exceptions.ServiceException)) {
    return new cartilla.exceptions.ServiceException(message, innerException);
  }

  return {
    getMessage: function() {
      return message;
    },
    getInnerException: function() {
      return innerException;
    }
  };
};

var exceptions = angular.module('exceptions', []);

exceptions.factory('errorHandler', function($log) {
  return {
    handle: function(error, title) {
      if(!error || error == '') {
        return '';
      }

      var message = '';

      if (error["getMessage"]) {
        message = JSON.stringify(error.getMessage());

        if (error.getInnerException()) {
          message += ' - ' + error.getInnerException().getMessage();
        }
      } else if (error instanceof cartilla.exceptions.DataException) {
          message = error.getMessage();
      } else {
        message = 'OcurriÃ³ un error inesperado - ' + error;


      }

      if(title && title != '') {
        message = title + ' - ' + message;
      }

      $log.error(message);

      return message;
    }
  };
});
