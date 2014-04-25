'use strict';

angular.module('bmmLibApp')
  .factory('bmmTranslation', [function () {
    
  var factory = {};

  factory.getTranslation = function(alias) {
    return $.ajax(alias+'.json').fail( function(xhr) {
      console.log(xhr);
    });
  };

  return factory;

}]);