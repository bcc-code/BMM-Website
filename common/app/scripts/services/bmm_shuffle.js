'use strict';

angular.module('bmmLibApp')
  .factory('bmmShuffle', [function () {
    
  var factory = function(arr) {

    var index = arr.length,
        randIndex,
        tempVal;

    // While there remain elements to shuffle
    while (0 !== index) {

      // Pick a remaining element
      randIndex = Math.floor(Math.random() * index);
      index -= 1;

      // And swap it with the current element
      tempVal = arr[index];
      arr[index] = arr[randIndex];
      arr[randIndex] = tempVal;
    }

    return arr;
  };

  return factory;

}]);