'use strict';

angular.module('bmmLibApp')
  .filter('bmmMin', function () {
    return function (str, size) {

      if (typeof size==='undefined') {
        size = 15;
      }

      if (str.length>size) {
        str = str.substring(0,size)+'...';
      }

      return str;

    };
  });
