'use strict';

angular.module('bmmLibApp')
  .factory('bmmIndex', [function () {
  
  var factory = {};

  factory.prev = function(index, max, prev, start) {

    if (typeof start === 'undefined') { start = 0; }

    if (index>=prev+start) { return index-prev; } else {
      return max - ((prev)-index);
    }

  };

  factory.next = function(index, max, next) {

    if ((index+next)<=max) { return index+next; } else {

      return (index+next)-max;
    }

  };

  return factory;

}]);
