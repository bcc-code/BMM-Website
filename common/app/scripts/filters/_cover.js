'use strict';

angular.module('bmmLibApp')
  .filter('_cover', function (_api) {
    return function (cover, type, id, antiCache) {

      var fallback_images = "fallback_images/";
      var prefix_url = _api.getProtectedFileServerUrl();
      if (cover && cover.indexOf("http") !== 0 && cover.indexOf(prefix_url) === -1 && cover.indexOf(fallback_images) === -1){
        cover = prefix_url + cover;
      }

      if (cover && cover.indexOf('auth=') == -1) {
        cover = _api.addAuthorizationQueryString(cover);
      }

      if (typeof cover==='undefined' || cover===null || cover==='') {
        if (typeof type==='undefined') {
          cover = 'fallback_images/svg/person.svg';
        } else {
          switch(type) {
            case 'speech':
            case 'exegesis':
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
      }

      return cover;
    };
  });
