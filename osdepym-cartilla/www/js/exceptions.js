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
