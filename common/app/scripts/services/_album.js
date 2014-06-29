'use strict';

angular.module('bmmLibApp')
  .factory('_album', ['_api', '_init', function (_api, _init) {
    
    var factory = {};

    factory.resolve = function(data) {

      var resolvedData = {};

      //Find cover image url
      resolvedData.cover = data.cover;
      if (resolvedData.cover===null) {
        resolvedData.cover='fallback_images/svg/album.svg';
      } else {
        resolvedData.cover = _api.secureImage(resolvedData.cover);
      }

      //Find title
      resolvedData.title = data.title;
      if (typeof resolvedData.title==='undefined'||resolvedData.title===''||resolvedData.title===null) {
        resolvedData.title=_init.translation.general.noTitle;
      }

      //Find id
      resolvedData.id = data.id;

      //Find raw
      resolvedData.raw = data;

      if (data.description!==null) {
        resolvedData.description = data.description;
      } else {
        resolvedData.description = '';
      }

      /**
       * Returns: title, cover, id, raw
       */

      return resolvedData;

    };

    return factory;

  }]);
