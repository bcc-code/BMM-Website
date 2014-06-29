'use strict';

angular.module('bmmLibApp')
  .filter('_icon', function () {
    return function (type) {

      var icon = 'fallback_images/svg/Icon_Music.svg';

      if (typeof type!=='undefined') {
        switch(type) {
          case 'speech':
          case 'exegesis':
            icon = 'fallback_images/svg/Icon_Edification.svg';
            break;
          case 'audiobook':
            icon = 'fallback_images/svg/Icon_Soundbook.svg';
            break;
          case 'video':
            icon = 'fallback_images/svg/Icon_Category-Video.svg';
            break;
          case 'playing':
            icon = 'fallback_images/svg/Icon_Now-playing.svg';
            break;
        }
      }

      return icon;

    };
  });
