'use strict';

angular.module('bmmApp')
  .controller('TrackCtrl', function (
    $filter,
    $scope,
    $location,
    $rootScope,
    $routeParams,
    $timeout,
    bmmTranslator,
    bmmApi,
    bmmPlay
  ) {

    $scope.$parent.contributors = false;
    var changes = false,
        trackGlobal = {},
        languageSelected;

    $scope.play = function(file, type) {
      bmmPlay.setPlay([{
        title: $scope.title,
        subtitle: file.mime_type,
        language: $scope.language,
        cover: $scope.cover,
        file: $filter('bmmFilePath')(file.path),
        duration: file.duration,
        type: type
      }], 0);
    };

    //Save track
    $scope.save = function(options) {

      var translations = [];

      //Inform user that saving is in progress
      $scope.information = 'Vent litt...';
      $scope.tempSave();

      //Copy translations into a format that is expected by API
      $.each($scope.translations, function() {

        var visible = this.is_visible;

        //@todo - remove this temp fix when API is updated

        if (typeof this.media!=='undefined') {
          var media = this.media;
          $.each(this.media, function(index) {

            if (typeof this.files!=='undefined') {

              $.each(this.files, function() {
                if (typeof this.length!=='undefined') {
                  this.duration = this.length;
                  delete this.length;
                }
              });

              if (this.files.length===0) {
                media.splice(index,1);
                visible = false;
              }

            }

          });
        }

        //Push data in correct format (Removes data used by client)
        translations.push({
          language: this.language,
          title: this.title,
          is_visible: visible,
          media: this.media
        });

      });

      //Send data to server
      bmmApi.trackPut(trackGlobal.id, {

        parent_id: trackGlobal.parent_id,
        is_visible: ($scope.published==='true'),
        tags: $scope.tags,
        order: trackGlobal.order,
        type: trackGlobal.type,
        subtype: $scope.type,
        categories: trackGlobal.categories,
        recorded_at: $scope.dateRecorded,
        published_at: $scope.datePublished,
        original_language: $scope.originalLanguage,
        //angular.copy() removes $$hash from array
        translations: angular.copy(translations),
        rel: angular.copy($scope.buildRelations()),
        cover: $scope.cover,
        cover_upload: null

      }).done(function() {

        //Inform user that track is saved
        $scope.information = 'Tracken er lagret!';
        $timeout(function() {
          $scope.information = '';
        }, 2000);

        $scope.refreshArchive();

        //Reset changes
        changes = false;

        //Send 'done' callback from where function was called from
        if (typeof options!=='undefined') {
          options.done(true);
        }

      }).fail(function() {

        //Inform user that track could not be saved
        $scope.information = 'Beklager, kunne ikke lagre - Feilmelding: (Se console)';
        $timeout(function() {
          $scope.information = '';
        }, 2000);

        $scope.$apply();

        //Reset changes
        changes = false;

        //Send 'done' callback from where function was called from
        if (typeof options!=='undefined') {
          options.done(false);
        }

      });

    };

    $scope.resolveRelations = function(relations) {

      $scope.composers = [];
      $scope.lyricists = [];
      $scope.interprets = [];
      $scope.songbooks = [];

      var timestamps = {}; //Bible grouping

      $.each(relations, function() {

        switch(this.type) {
          case 'bible':
            
            //Group by timestamp
            if (typeof this.timestamp!=='undefined') {
              
              //Create if not exist
              if (typeof timestamps[this.timestamp]==='undefined') {
                timestamps[this.timestamp] = {};
              }

              //Append book to timestamp
              if (typeof this.book!=='undefined') {

                //Create if not exist
                if (typeof timestamps[this.timestamp][this.book]==='undefined') {
                  timestamps[this.timestamp][this.book] = {};
                }

                //Append chapter to book
                if (typeof this.chapter!=='undefined') {

                  //Create if not exist
                  if (typeof timestamps[this.timestamp][this.book][this.chapter]==='undefined') {
                    timestamps[this.timestamp][this.book][this.chapter] = [];
                  }

                  //Append verse to chapter
                  if (typeof this.verse!=='undefined') {
                    timestamps[this.timestamp][this.book][this.chapter].push(this.verse);
                  }

                }

              }

            }

            break;
          case 'composer':
          
            $scope.composers.push(this.name);

            break;
          case 'lyricist':
          
            $scope.lyricists.push(this.name);

            break;
          case 'interpret':
            $scope.interprets.push(this.name);

            break;
          case 'songbook':
          
            if (typeof this.id!=='undefined') {

              if (typeof this.name==='undefined') {
                this.name = '';
              }

              if (typeof this.timestamp==='undefined') {
                this.timestamp = 0;
              }

              $scope.songbooks.push({
                id: this.id,
                name: this.name,
                timestamp: this.timestamp,
                type: 'songbook'
              });

            }

            break;
          default:
            //Save as stash @todo - fix
            break;
        }

      });

      //Write bible to scope
      $.each(timestamps, function(timestamp) {

        var raw = '', i=0;

        //Each book
        $.each(this, function(book) {

          var ii = 0;

          if (i!==0) {
            raw += ' | '; //Defines a new book
          }

          raw += book;
          i++;

          //Each chapter
          $.each(this, function(chapter) {

            if (ii!==0) {
              raw += ' &'; //Defines a new chapter
            } else {

            }

            raw += ' '+chapter;
            ii++;

            //Each verse = []
            $.each(this, function(index) {

              if (index!==0) {
                raw += ' + '+this; //Defines a new verse
              } else {
                raw += ', '+this;
              }

            });

          });

        });

        $scope.bibles.push({
          raw: raw,
          time: $filter('bmmTime')(timestamp)
        });

      });

    };

    $scope.buildRelations = function() {

      var relations = [];

      $.each($scope.getBibleRelations(), function() {
        relations.push(this);
      });

      $.each($scope.lyricists, function() {
        relations.push({
          type: 'lyricist',
          name: this
        });
      });

      $.each($scope.composers, function() {
        relations.push({
          type: 'composer',
          name: this
        });
      });

      $.each($scope.interprets, function() {
        relations.push({
          type: 'interpret',
          name: this
        });
      });

      $.each($scope.songbooks, function() {
        relations.push(this);
      });

      return relations;
    };

    $scope.getBibleRelations = function() {
      
      var relations = [], book, chapter, time;
      $.each($scope.bibles, function() {

        //Convert time
        time = this.time.split(':');
        if (time.length===3) {
          time = (parseInt(time[0],10)*60*60)+(parseInt(time[1])*60)+parseInt(time[2],10);
        } else if (time.length===2) {
          time = (parseInt(time[0],10)*60)+parseInt(time[1],10);
        } else if (time.length===1) {
          time = parseInt(time[0],10);
        }

        $.each(this.filtered, function() {
          book = this.key;
          if (typeof this.chapters[0].number==='undefined') {
            /*relations.push({
              type: 'bible',
              timestamp: time,
              book: book
            });*/// Requires chapter
          }

          $.each(this.chapters, function() {
            chapter = this.number;
            if (this.verses.length===0&&typeof this.number!=='undefined') {
              /*relations.push({
                type: 'bible',
                timestamp: time,
                book: book,
                chapter: chapter
              });*/// Requires verse
            }

            $.each(this.verses, function() {
              
              relations.push({
                type: 'bible',
                timestamp: time,
                book: book,
                chapter: chapter,
                verse: this
              });

            });

          });

        });

      });

      return relations;
    };

    //Remove file width index (files is added by track_uploader_Ctrl)
    $scope.removeFile = function(typeIndex,index) {
      $scope.media[typeIndex].files.splice(index,1);
      $scope.save();
    };

    //Remove cover image
    $scope.removeCover = function() {
      $scope.cover = null;
      $scope.coverImage = null;
      $scope.save();
    };

    //Add tags
    $scope.tagSuggestions = ['child-favorites','mp3-kilden','instrumental'];
    $scope.tags = [];
    $scope.addTag = function(tag) {
      $scope.tags.splice(0,0,tag);
      $scope.tag = '';
    };

    //Remove tag width index
    $scope.removeTag = function(index) {
      if (typeof index!=='undefined') {
        $scope.tags.splice(index,1);
      }
    };

    $scope.addInterpret = function(interpret) {
      $scope.interprets.splice(0,0,interpret);
      $scope.interpret = '';
    };

    $scope.removeInterpret = function(index) {
      if (typeof index!=='undefined') {
        $scope.interprets.splice(index,1);
      }
    };

    $scope.addComposer = function(composer) {
      $scope.composers.splice(0,0,composer);
      $scope.composer = '';
    };

    $scope.removeComposer = function(index) {
      if (typeof index!=='undefined') {
        $scope.composers.splice(index,1);
      }
    };

    $scope.addLyricist = function(lyricist) {
      $scope.lyricists.splice(0,0,lyricist);
      $scope.lyricist = '';
    };

    $scope.removeLyricist = function(index) {
      if (typeof index!=='undefined') {
        $scope.lyricists.splice(index,1);
      }
    };

    $scope.songbookSuggestions = ['herrens_veier','mandelblomsten'];
    $scope.addSongbook = function(songbook) {
      $scope.songbooks.splice(0,0,{
        id: songbook.id,
        name: songbook.name,
        timestamp: 0, //Timestamp for phase 2
        type: 'songbook'
      });
      $scope.songbook = '';
    };

    $scope.removeSongbook = function(index) {
      if (typeof index!=='undefined') {
        $scope.songbooks.splice(index,1);
      }
    };

    //Possible types of track
    $scope.types = [
      { name: 'Tale', value: 'speech' },
      { name: 'Sang', value: 'song' },
      { name: 'Video', value: 'video' },
      { name: 'Lydbok', value: 'audiobook' },
      { name: 'Allsang', value: 'singsong' },
      { name: 'Tydning', value: 'exegesis' }
    ];

    //Add bible verse
    $scope.bibles = [];
    $scope.addVerse = function() {
      $scope.bibles.splice(0,0, {
        time: $filter('bmmTime')($scope.timeCurrent)
      });
    };

    //Remove verse width index
    $scope.removeVerse = function(index) {
      if (typeof index!=='undefined') {
        $scope.bibles.splice(index,1);
      }
    };

    //Pause recording
    $scope.pause = function() {
      $scope.isPaused = true;
    };
    
    //Start / Continue recording
    $scope.timeCurrent=0;
    $scope.record = function() {

      $scope.isPaused = false;
      $scope.count();
      
    };

    //Count when recording
    $scope.isPaused = true;
    $scope.count = function() {

      $scope.timeCurrent = ($scope.timeCurrent+1);
      
      $timeout(function() {

        if (!$scope.isPaused) {
          $scope.count();
        }
        
      }, 1000);

    };

    //Set count to zero
    $scope.resetTimer = function() {
      if (confirm('Vil du resette tiden?')) {
        $scope.timeCurrent = 0;
        $scope.isPaused = true;
      }
    };

    //Delete the whole track with all its content
    $scope.delete = function() {
      if (confirm(
        '***ADVARSEL!*** Vil du virkelig slette '+
        'denne tracken med alle dets oversettelser '+
        'og media filer?'
      )) {
        bmmApi.trackDelete(trackGlobal.id).always(function() {

          $scope.refreshArchive();
          $location.path( '/welcome' );

        });
      }
    };

    //Save changed data temporary in client
    $scope.tempSave = function() {
      
      //Save changes to the current selected language
      $.each($scope.translations, function() {
        if (this.language===languageSelected) {
          this.title = $scope.title;
          this.name = this.name;
          this.is_visible = ($scope.visible==='true');
          this.media = $scope.media;
          return false;
        }
      });

    };

    //Change original language to another language
    $scope.setOriginal = function() {

      //Set selected language as the new original language
      $.each($scope.translations, function() {
        if (this.language===$scope.language) {
          $scope.originalLanguage = this.language;
          $scope.title = this.title;
          this.name = this.name+' (original)';
          $scope.visible = String(this.is_visible);
          $scope.media = this.media;
        } else {
          this.name = this.language;
        }
      });

      //Disable option to delete or set as original for selected language
      $scope.languageDisableEdit = true;

    };

    //When changes are made in input boxes
    $scope.change = function() {
      changes = true;
    };

    //When language selection has changed
    $scope.languageSelect = function() {

      $scope.tempSave();
      languageSelected = $scope.language;

      if ($scope.language===$scope.originalLanguage) {
        //Disable option to delete or set as original for selected language
        $scope.languageDisableEdit = true;
      } else {
        $scope.languageDisableEdit = false;
      }

      //Set selected language as the new editable language
      $.each($scope.translations, function() {
        if (this.language===$scope.language) {
          $scope.title = this.title;
          $scope.visible = String(this.is_visible);
          $scope.media = this.media;
          return false;
        }
      });

    };

    //Add language that should be translated
    $scope.addLanguage = function() {

      //Find current selected
      $.each($scope.availables, function(index) {

        //If found
        if (this.value===$scope.available) {

          //Append to translation list
          $scope.translations.push(this);

          //Remove from available for translation list
          $scope.availables.splice(index,1);

          //Set next first free in available list as current selected
          if ($scope.availables.length!==0) {
            $scope.available = $scope.availables[0].value;
          }
          return false;
        }

      });

    };

    //Remove language that should not be translated
    $scope.removeLanguage = function() {

      //Find current selected
      $.each($scope.translations, function(index) {

        //If found
        if (this.value===$scope.language) {

          //Append to available list
          $scope.availables.push(this);

          //Remove from translation for available list
          $scope.translations.splice(index,1);

          //Set next first free in language list as current selected
          if ($scope.translations.length!==0) {
            $scope.language = $scope.translations[0].value;
            $scope.fileLanguage = $scope.translations[0].value;

            //When original language is selected
            if ($scope.language === $scope.originalLanguage) {
              //Disable option to delete or set as original
              $scope.languageDisableEdit = true;
            
            //When translation is selected
            }
          }
          return false;
        }

      });

    };

    //Load track from server
    $scope.loadTrack = function() {

      //Store translated and available languages in separate lists
      $scope.translations = [];
      $scope.availables = [];

      //Get root data which contains languages available
      bmmApi.root().done(function(root) {

        //Get album
        bmmApi.trackGet(
          //Track id defined in path
          $routeParams.id,'',
          {
            raw: true //Get raw data (all as is)
          }
        ).done(function(track) {

            trackGlobal = track;

            //Make list of translated languages
            var i = 0, translatedList = [];
            $.each(track.translations, function() {
                
              //Add translation to translated list
              translatedList.push(this.language);

              //When original language occur
              if (this.language===track.original_language) {
                
                //Set duration as 0 if no length
                if (typeof this.media!=='undefined') {
                  $.each(this.media, function() {
                    if (typeof this.files!=='undefined') {
                      $.each(this.files, function() {
                        if (typeof this.duration!=='undefined'&&this.duration===null) {
                          this.duration = 0;
                        }
                      });
                    }
                  });
                }

                //Append translation to scope
                $scope.translations.push({
                  //Used for selection options
                  name: this.language+' (original)', //Users view
                  value: this.language, //Option value
                  //Below is a copy of data from 'this'
                  language: this.language,
                  title: this.title,
                  media: this.media,
                  is_visible: this.is_visible
                });

                //Set title
                $scope.title = this.title;

                //Set visibility
                $scope.visible = String(this.is_visible);

                //Set original language
                $scope.originalLanguage = languageSelected = this.language;

                //Set original language as selected
                $scope.language = $scope.translations[i].value;

                //Disable remove and 'set as original' for original
                $scope.languageDisableEdit = true;

                //Set media
                $scope.media = this.media;

              } else {
                //Translations as option in scope
                $scope.translations.push({
                  //Used for selection options
                  name: this.language, //Users view
                  value: this.language, //Option value
                  //Below is a copy of data from 'this'
                  language: this.language,
                  title: this.title,
                  media: this.media,
                  is_visible: this.is_visible
                });
              }

              i++;

            });

            $scope.resolveRelations(track.rel);

            //Published?
            $scope.published = String(track.is_visible);

            //Tags
            $scope.tags = track.tags;

            //Set subtype
            $scope.type = track.subtype;

            //Set cover
            if (typeof track.cover==='undefined') {
              track.cover = null;
            }

            $scope.cover = track.cover;
            if (track.cover!==null) {
              $scope.coverImage = bmmApi.getserverUrli()+'track/'+$routeParams.id+'/cover';
            } else {
              $scope.coverImage = null;
            }

            //Set recorded date
            $scope.dateRecorded = new Date(track.recorded_at);

            //Set published date
            $scope.datePublished = new Date(track.published_at);

            //Languages not translated
            i=0;
            $.each(root.languages, function() {
              if ($.inArray(this, translatedList)===-1) {
                $scope.availables.push({
                  //Used for selection options
                  name: this, //Users view
                  value: this, //Option value
                  //Below is a copy of data from 'this'
                  language: this,
                  title: '',
                  media: [],
                  is_visible: false
                });
                if (i===0) {
                  $scope.available = $scope.availables[i].value;
                }
                i++;
              }
            });

            //Apply changes to $scope view
            $scope.$apply();

          });

      });

    };

    //Load track on page load
    $scope.loadTrack();

  });
