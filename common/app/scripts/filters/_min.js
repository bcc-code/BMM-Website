'use strict';

angular.module('bmmLibApp')
  .filter('_min', function () {
    return function (str, size) {

      if (typeof size==='undefined') {
        size = 15;
      }

      if (typeof str!=='undefined') {
        if (str.length>size) {
          str = str.substring(0,size)+'...';
        }
      } else {
        str = '';
      }

      return str;

    };
  });
