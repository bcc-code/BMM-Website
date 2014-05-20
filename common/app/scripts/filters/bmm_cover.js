'use strict';

angular.module('bmmLibApp')
  .filter('bmmCover', [ 'bmmApi', function (bmmApi) {
    return function (cover, type, id) {

      if (cover===null) {
        if (typeof type==='undefined') {
          cover = 'fallback_images/svg/person.svg';
        } else {
          switch(type) {
            case 'speech':
              cover='fallback_images/svg/speech.svg';
              break;
            case 'song':
            case 'singsong':
            case 'audiobook':
              cover='fallback_images/svg/song.svg';
              break;
            case 'video':
              cover='fallback_images/svg/video.svg';
              break;
            case 'contributor':
              cover='fallback_images/svg/person.svg';
              break;
            case 'album':
              cover='fallback_images/svg/album.svg';
              break;
            default:
              cover='fallback_images/svg/bmm.svg';
              break;
          }
        }
      } else if (typeof id!=='undefined') {
        cover = bmmApi.secureFile(bmmApi.getserverUrli()+type+'/'+id+'/cover');
      }
      
      return cover;
    };
  }]);
