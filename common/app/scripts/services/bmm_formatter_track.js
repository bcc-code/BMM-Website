'use strict';

angular.module('bmmLibApp')
  .factory('bmmFormatterTrack', ['bmmApi', 'init', function (bmmApi, init) {
    
    var factory = {};

    factory.resolve = function(data) {

      var resolvedData = {};

      if (typeof data.cover!=='undefined'&&data.cover!==null) {

        resolvedData.cover = data.cover;

      } else {

        //Find album cover image url
        if (typeof data._meta!=='undefined'&&
            typeof data._meta.parent!=='undefined'&&
            typeof data._meta.parent.cover!=='undefined'&&
            data._meta.parent.cover!==null) {

          resolvedData.cover = bmmApi.secureFile(data._meta.parent.cover);

        } else if (typeof data._meta!=='undefined'&&
            typeof data._meta.root_parent!=='undefined'&&
            typeof data._meta.root_parent.cover!=='undefined'&&
            data._meta.root_parent.cover!==null) {

          resolvedData.cover = bmmApi.secureFile(data._meta.root_parent.cover);

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

      //Find file type, url and length
      if (typeof data.media!=='undefined'&&data.media!==null&&data.media.length>0) {

        resolvedData.videos = [];
        resolvedData.audios = [];
        resolvedData.unknowns = [];
        resolvedData.video = false;
        resolvedData.audio = false;
        resolvedData.unknown = false;

        //In media there can currently be 'audio' and 'video'
        $.each( data.media, function() {

          //Get duration from first file available
          //If audio and video exist it will be overwritten one time
          resolvedData.duration = Number(this.files[0].duration);

          var _type = this.type;

          $.each(this.files, function() {
            if (_type==='video') {
              resolvedData.video = true;
              resolvedData.videos.push({
                file: bmmApi.secureFile(this.url),
                type: this.mime_type,
                duration: Number(this.duration)
              });
            } else {
              resolvedData.audio = true;
              resolvedData.audios.push({
                file: bmmApi.secureFile(this.url),
                type: this.mime_type,
                duration: Number(this.duration)
              });
            }
          });

        });

      }

      //If track is a waiting, fetch waiting file
      if (typeof data.link!=='undefined') {
        var _file = bmmApi.getserverUrli()+'file/protected/upload/'+data.link;
        resolvedData.unknown = true;
        resolvedData.unknowns.push({
          file: bmmApi.secureFile(_file),
          type: 'Unknown',
          duration: 0
        });
        resolvedData.link = data.link;
      }

      //If only one file exist, make a direct download
      resolvedData.directDownload = {};
      resolvedData.directDownload.exist = false;
      if (resolvedData.audios.length+
          resolvedData.videos.length+
          resolvedData.unknowns.length===1) {

        if (resolvedData.audios.length===1) {
          resolvedData.directDownload = {
            file: resolvedData.audios[0].file,
            type: resolvedData.audios[0].mime_type,
            duration: Number(resolvedData.audios[0].duration)
          }
        }

        if (resolvedData.videos.length===1) {
          resolvedData.directDownload = {
            file: resolvedData.videos[0].file,
            type: resolvedData.videos[0].mime_type,
            duration: Number(resolvedData.videos[0].duration)
          }
        }

        if (resolvedData.unknowns.length===1) {
          resolvedData.directDownload = {
            file: resolvedData.unknowns[0].file,
            type: resolvedData.unknowns[0].mime_type,
            duration: Number(resolvedData.unknowns[0].duration)
          }
        }

        resolvedData.directDownload.exist = true;

      }

      //Find title
      resolvedData.title = '';
      if (typeof data.title!=='undefined') {
        resolvedData.title = data.title;
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
        resolvedData.bible = '';
        resolvedData.unsorted = '';
        resolvedData.interprets = [];
        resolvedData.lyricists = [];
        resolvedData.composers = [];

        //Format relations to strings
        $.each(resolvedData.relations, function(key) {

          switch (key) {

            case 'lyricist':

              $.each(resolvedData.relations[key], function(index) {
                resolvedData.lyricists.push(this);
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
                if ((resolvedData.relations[key].length-1)===index) {
                  resolvedData.bible+= this.book+' '+this.chapter+':'+this.verse;
                } else {
                  resolvedData.bible+= this.book+' '+this.chapter+':'+this.verse+', ';
                }
              });

              break;
            case 'songbook':

              if (resolvedData.title==='') {
                $.each(resolvedData.relations[key], function(index) {
                  var name;
                  if (this.name==='herrens_veier') {
                    name = 'HV';
                  } else {
                    name = 'MB';
                  }
                  if ((resolvedData.relations[key].length-1)===index) {
                    resolvedData.title+= name+' '+this.id;
                  } else {
                    resolvedData.title+= name+' '+this.id+', ';
                  }
                });
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
          resolvedData.combinedTitle = init.translation.track.exegesis;
        } else {
          resolvedData.combinedTitle = resolvedData.title + bindSign + resolvedData.performers;
        }

        if (resolvedData.combinedTitle === '') {
          resolvedData.combinedTitle = init.translation.general.noTitle;
        }

      }

      resolvedData.raw = data;

      /**
       * Returns: file, duration, type (filetype), performers, title, cover, bible, parentTitle, subtype,
       *          combinedTitle, parentRootTitle, albumTitle, raw, lyricists, composers, interprets
       */

      return resolvedData;

    };

    return factory;

  }]);
