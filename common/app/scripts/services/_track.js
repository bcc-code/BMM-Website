'use strict';

angular.module('bmmLibApp')
  .factory('_track', function ($location, _api, _init) {
    
    var factory = {};

    factory.resolve = function(data) {

      if (typeof data!=='undefined') {

        var resolvedData = {};

        if (typeof data.cover!=='undefined'&&data.cover!==null) {

          resolvedData.cover = data.cover;

        } else {

          //Find album cover image url
          if (typeof data._meta!=='undefined'&&
              typeof data._meta.parent!=='undefined'&&
              typeof data._meta.parent.cover!=='undefined'&&
              data._meta.parent.cover!==null) {

            resolvedData.cover = _api.secureImage(data._meta.parent.cover);

          } else if (typeof data._meta!=='undefined'&&
              typeof data._meta.root_parent!=='undefined'&&
              typeof data._meta.root_parent.cover!=='undefined'&&
              data._meta.root_parent.cover!==null) {

            resolvedData.cover = _api.secureImage(data._meta.root_parent.cover);

          } else {

            switch(data.subtype) {
              case 'speech':
                resolvedData.cover='fallback_images/svg/speech.svg';
                break;
              case 'song':
              case 'singsong':
              case 'audiobook':
                resolvedData.cover='fallback_images/svg/song.svg';
                break;
              case 'video':
                resolvedData.cover='fallback_images/svg/video.svg';
                break;
              default:
                resolvedData.cover='fallback_images/svg/person.svg';
                break;
            }

          }

        }

        //Path
        resolvedData.path = $location.absUrl();
        resolvedData.path = resolvedData.path.replace($location.path(), '/track/'+data.id+'/'+data.language);

        //Find parent title
        if (typeof data._meta!=='undefined'&&
            typeof data._meta.parent!=='undefined'&&
            typeof data._meta.parent.title!=='undefined') {
          resolvedData.parentTitle = data._meta.parent.title;
        } else {
          resolvedData.parentTitle='';
        }

        //Find root title
        if (typeof data._meta!=='undefined'&&
            typeof data._meta.root_parent!=='undefined'&&
            typeof data._meta.root_parent.title!=='undefined') {
          resolvedData.parentRootTitle = data._meta.root_parent.title;
        } else {
          resolvedData.parentRootTitle='';
        }

        //Set album title
        if (resolvedData.parentTitle!==resolvedData.parentRootTitle) {
          if (resolvedData.parentTitle!==''&&resolvedData.parentRootTitle!=='') {
            resolvedData.albumTitle = resolvedData.parentRootTitle+' - '+resolvedData.parentTitle;
          } else {
            resolvedData.albumTitle = resolvedData.parentRootTitle+' '+resolvedData.parentTitle;
          }
        } else {
          resolvedData.albumTitle = resolvedData.parentRootTitle;
        }
        //Get from id3 as last option
        if (resolvedData.albumTitle === '' &&
            typeof data._meta!=='undefined'&&
            typeof data._meta.album!=='undefined') {
          resolvedData.albumTitle=data._meta.album;
        }

        var renameMimeType = function(mimeType) {
          switch(mimeType) {
            case 'audio/mpeg': return 'mp3'; break;
            case 'video/mp4': return 'mp4'; break;
            case 'application/ogg': return 'ogg'; break;
            case 'video/webm': return 'webmv'; break;
            case 'audio/webm': return 'webma'; break;
            default: return mimeType; break;
          }
        };

        resolvedData.videos = [];
        resolvedData.audios = [];
        resolvedData.video = false;
        resolvedData.audio = false;

        //Find file type, url and length
        if (typeof data.media!=='undefined'&&data.media!==null&&data.media.length>0) {

          //In media there can currently be 'audio' and 'video'
          $.each( data.media, function() {

            var _type = this.type;

            $.each(this.files, function() {
              //Get duration from a file available
              resolvedData.duration = Number(this.duration);

              if (_type==='video') {
                resolvedData.video = true;
                resolvedData.videos.push({
                  file: this.url,
                  downloadLink: this.url+'&download=1',
                  type: this.mime_type,
                  name: renameMimeType(this.mime_type),
                  duration: Number(this.duration)
                });
              } else {
                resolvedData.audio = true;
                resolvedData.audios.push({
                  file: this.url,
                  downloadLink: this.url+'&download=1',
                  type: this.mime_type,
                  name: renameMimeType(this.mime_type),
                  duration: Number(this.duration)
                });
              }
            });

          });

        }

        //If track is a waiting, fetch waiting file
        if (typeof data.link!=='undefined') {
          var _file = _api.getserverUrli()+'file/protected/upload/'+data.link.file;
          if (typeof data.link.conflict!=='undefined'&&data.link.conflict) {
            _file = data.link.file;
          }
          resolvedData[data.link.type] = true;
          resolvedData[(data.link.type+'s')] = [];
          resolvedData[(data.link.type+'s')].push({
            file: _file,
            downloadLink: _file+'&download=1',
            type: data.link.mime_type,
            name: renameMimeType(data.link.mime_type),
            duration: data.link.duration
          });
          resolvedData.link = data.link;
        }

        //If only one file exist, make a direct download
        resolvedData.directDownload = {};
        resolvedData.directDownload.exist = false;
        if (resolvedData.audios.length+
            resolvedData.videos.length===1) {

          if (resolvedData.audios.length===1) {
            resolvedData.directDownload = {
              file: resolvedData.audios[0].downloadLink,
              type: resolvedData.audios[0].mime_type,
              name: renameMimeType(resolvedData.audios[0].mime_type),
              duration: Number(resolvedData.audios[0].duration)
            }
          }

          if (resolvedData.videos.length===1) {
            resolvedData.directDownload = {
              file: resolvedData.videos[0].downloadLink,
              type: resolvedData.videos[0].mime_type,
              name: renameMimeType(resolvedData.videos[0].mime_type),
              duration: Number(resolvedData.videos[0].duration)
            }
          }

          resolvedData.directDownload.exist = true;

        }

        //Find title
        resolvedData.title = '';
        if (typeof data._meta.title!=='undefined' && data._meta.title!=='') {
          resolvedData.title = data._meta.title;
        }

        //Find publisher
        resolvedData.publisher = '';
        if (typeof data._meta.publisher!=='undefined' && data._meta.publisher!=='') {
          resolvedData.publisher = data._meta.publisher;
        } 

        //Find copyright
        resolvedData.copyright = '';
        if (typeof data._meta.copyright!=='undefined' && data._meta.copyright!=='') {
          resolvedData.copyright = data._meta.copyright;
        } 

        //Find all relations
        if (typeof data.rel!=='undefined') {

          resolvedData.relations = {};

          //Sort relations to objects based on type
          $.each(data.rel, function() {

            var currentRelation = this;

            //Check that relation 'type' is created
            if (typeof resolvedData.relations[currentRelation.type]==='undefined') {
              resolvedData.relations[currentRelation.type] = [];
            }

            //Create object without type defined in object
            var newRelation = {};

            for (var key in currentRelation) {
              if (key!=='type') {
                newRelation[key] = currentRelation[key];
              }
            }

            //Push new object to relations with content of 'type'
            resolvedData.relations[currentRelation.type].push(newRelation);

          });

          //Expected relations
          resolvedData.performers = '';
          resolvedData.bible = [];
          resolvedData.unsorted = '';
          resolvedData.interprets = [];
          resolvedData.lyricists = [];
          resolvedData.arrangers = [];
          resolvedData.composers = [];
          resolvedData.songbooks = "";

          //Format relations to strings
          $.each(resolvedData.relations, function(key) {

            switch (key) {

              case 'lyricist':

                $.each(resolvedData.relations[key], function(index) {
                  resolvedData.lyricists.push(this);
                });

              break;
              case 'arranger':

                $.each(resolvedData.relations[key], function(index) {
                  resolvedData.arrangers.push(this);
                });

              break;
              case 'composer':

                $.each(resolvedData.relations[key], function(index) {
                  resolvedData.composers.push(this);
                });

              break;
              case 'interpret':

                $.each(resolvedData.relations[key], function(index) {
                  resolvedData.interprets.push(this);
                  if ((resolvedData.relations[key].length-1)===index) {
                    resolvedData.performers+= this.name;
                  } else {
                    resolvedData.performers+= this.name+', ';
                  }
                });

                break;
              case 'bible':

                $.each(resolvedData.relations[key], function(index) {
                  resolvedData.bible.push({
                    name: this.book+' '+this.chapter+' '+this.verse,
                    timestamp: this.timestamp
                  });
                });

                break;
              case 'songbook':

                $.each(resolvedData.relations[key], function(index) {
                  var name;
                  if (this.name==='herrens_veier') {
                    name = 'HV';
                  } else {
                    name = 'MB';
                  }
                  if ((resolvedData.relations[key].length-1)===index) {
                    resolvedData.songbooks += name+' '+this.id;
                  } else {
                    resolvedData.songbooks += name+' '+this.id+', ';
                  }
                });
                if (resolvedData.title==='') {
                  resolvedData.title+= resolvedData.songbooks;
                }

                break;
              default:

                resolvedData.unsorted+='<b>'+key+':</b> ';
                $.each(resolvedData.relations[key], function(index) {
                  if ((resolvedData.relations[key].length-1)===index) {
                    resolvedData.unsorted+= this.name;
                  } else {
                    resolvedData.unsorted+= this.name+', ';
                  }
                });
                resolvedData.unsorted+='<br>';

                break;
            }

          });

          //id
          resolvedData.id = data.id;

          //language
          resolvedData.language = data.language;

          //date
          resolvedData.date = data.recorded_at;

          //subtype
          resolvedData.subtype = data.subtype;

          //Combined title
          var bindSign = ' - ';
          if (resolvedData.performers===''&&resolvedData.title==='') {
            bindSign = '-';
          } else if (resolvedData.performers===''||resolvedData.title==='') {
            bindSign = '';
          }

          if (resolvedData.subtype==='speech') {
            resolvedData.combinedTitle = resolvedData.performers + bindSign + resolvedData.title;
          } else if (resolvedData.subtype==='exegesis') {
            resolvedData.combinedTitle = _init.translation.track.exegesis;
          } else {
            resolvedData.combinedTitle = resolvedData.title + bindSign + resolvedData.performers;
          }

          if (resolvedData.combinedTitle === '') {
            resolvedData.combinedTitle = _init.translation.general.noTitle;
          }

        }

        resolvedData.raw = data;

        /**
         * Returns: path, file, duration, type (filetype), performers, title, cover, bible, parentTitle, subtype,
         *          combinedTitle, parentRootTitle, albumTitle, raw, lyricists, arrangers, composers, interprets,
         *          songbooks, publisher, copyright
         */

        return resolvedData;

      } else {
        return {};
      }

    };

    return factory;

  });
