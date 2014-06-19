'use strict';

angular.module('bmmLibApp')
  .factory('bmmFormatterAlbum', ['bmmApi', 'init', function (bmmApi, init) {
    
    var factory = {};

    factory.resolve = function(data) {

      var resolvedData = {};

      //Find cover image url
      resolvedData.cover = data.cover;
      if (resolvedData.cover===null) {
        resolvedData.cover='fallback_images/svg/album.svg';
      } else {
        resolvedData.cover = bmmApi.secureImage(resolvedData.cover);
      }

      //Find title
      resolvedData.title = data.title;
      if (typeof resolvedData.title==='undefined'||resolvedData.title===''||resolvedData.title===null) {
        resolvedData.title=init.translation.general.noTitle;
      }

      //Find id
      resolvedData.id = data.id;

      if (data.description!==null) {
        resolvedData.description = data.description;
      } else {
        resolvedData.description = '';
      }

      /**
       * Returns: title, cover, id
       */

      return resolvedData;

    };

    return factory;

  }]);
