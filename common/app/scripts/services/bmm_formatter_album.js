'use strict';

angular.module('bmmLibApp')
  .factory('bmmFormatterAlbum', [ function () {
    
    var factory = {};

    factory.resolve = function(data) {

      var resolvedData = {};

      //Find cover image url
      resolvedData.cover = data.cover;
      if (resolvedData.cover===null) {
        resolvedData.cover='fallback_images/svg/album.svg';
      }

      //Find title
      resolvedData.title = data.title;
      if (typeof resolvedData.title==='undefined'||resolvedData.title===''||resolvedData.title===null) {
        resolvedData.title='-';
      }

      //Find id
      resolvedData.id = data.id;

      if (data.description!==null) {
        resolvedData.description = data.description;
      } else {
        resolvedData.description = 'Ingen informasjon';
      }

      /**
       * Returns: title, cover, id
       */

      return resolvedData;

    };

    return factory;

  }]);
