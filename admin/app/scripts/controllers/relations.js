'use strict';

angular.module('bmmApp')
  .controller('RelationsCtrl', function (
      $scope,
      $filter,
      $timeout,
      _api,
      _init
    ) {

    var unknownRelations = [], loaded = false;

    $scope.recorder = 0;
    $scope.recording = false;
    $scope.recorderReset = function() {
      $scope.recorder = 0;
    };
    $scope.toggleRecord = function() {
      $scope.recording = !$scope.recording;
    };
    var clock = function() {
      $timeout(function() {
        if ($scope.recording) {
          $scope.$apply(function() {
            $scope.recorder = $scope.recorder+1;
          });
        }
        clock();
      }, 1000);
    };
    clock();

    $scope.rel = {};

    //POSSIBLE RELATIONS

    //type: bible
    //timestamp:
    //book:
    //chapter:
    //verse:

    //type: songbook
    //name:
    //id:

    //type: composer
    //name:

    //type: lyricist
    //name:

    //type: interpret
    //name:

    var groupBibles = function(array) {
      //Group by timestamp
      var timestamps = {}, bibles = [];
      $.each(array, function() {
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
      });

      //Write bible to scope
      $.each(timestamps, function(timestamp) {

        var raw = '', i= 0, ii=0;
        //Each book
        $.each(this, function(book) {

          ii = 0;
          if (i!==0) { raw += ' | '; } //Defines a new book
          raw += _init.bible.shortcodes[book];
          i++;

          //Each chapter
          $.each(this, function(chapter) {

            if (ii!==0) {
              raw += ' &'; //Defines a new chapter
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

        bibles.push({
          raw: raw,
          time: $filter('_time')(timestamp)
        });
      });

      return bibles;
    };

    var getRelations = function() {
      unknownRelations = [];

      //Important note: objects is defined as: $scope.[type + 's']
      var bibles = [];
      $scope.rel.songbooks = [];
      $scope.rel.composers = [];
      $scope.rel.lyricists = [];
      $scope.rel.interprets = [];
      $scope.rel.bibles = [];

      $.each($scope.$parent.model.rel, function() {
        if (typeof $scope.rel[this.type+'s']==='undefined') {
          unknownRelations.push(this);
        } else {
          if (this.type==='bible') {
            bibles.push(this);
          } else {
            if (this.type==='songbook') {
              this.timestamp = $filter('_time')(this.timestamp);
            }
            $scope.rel[this.type+'s'].push(this);
          }
        }
      });

      $scope.rel.bibles = groupBibles(bibles);
    };

    $scope.$watch('$parent.model', function(model) {
      if (typeof model.rel!=='undefined'&&!loaded) {
        getRelations();
        loaded=true;
      }
    }, true);

    var convertTime = function(time) {
      time = time.split(':');
      if (time.length===3) {
        time = (parseInt(time[0],10)*60*60)+(parseInt(time[1])*60)+parseInt(time[2],10);
      } else if (time.length===2) {
        time = (parseInt(time[0],10)*60)+parseInt(time[1],10);
      } else if (time.length===1) {
        time = parseInt(time[0],10);
      }
      return time;
    };

    var ungroupBibles = function(array) {

      var relations = [], book, chapter, time;
      $.each(array, function() {

        //Convert time
        time = convertTime(this.time);

        $.each($filter('_bibleVerse')(this.raw), function() {
          book = this.key;

          $.each(this.chapters, function() {
            chapter = this.number;

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

    var unfilterTime = function(array) {
      var newArray = [];
      $.each(array, function() {
        newArray.push({
          type: 'songbook',
          id: this.id,
          name: this.name,
          timestamp: convertTime(this.timestamp)
        });
      });
      return newArray;
    };

    var setRelations = function(rel) {

      var relations = [];

      $.each(ungroupBibles(rel.bibles), function() { relations.push(this); });
      $.each(unfilterTime(rel.songbooks), function() { relations.push(this); });
      $.each(rel.composers, function() { relations.push(this); });
      $.each(rel.lyricists, function() { relations.push(this); });
      $.each(rel.interprets, function() { relations.push(this); });
      $.each(unknownRelations, function() { relations.push(this); });

      $scope.$parent.model.rel = relations;

    };

    $scope.addContributor = function(contributor) {
      if (contributor!=='') {
        _api.contributorPost({
          type: 'contributor',
          is_visible: true,
          name: contributor,
          cover_upload: null
        }).always(function() {
          $timeout(function() {
            _api.contributorSuggesterCompletionGet(contributor).done(function(data) {
              $scope.$apply(function() {
                $scope.contributors.interprets = data;
                $scope.contributors.lyricists = data;
                $scope.contributors.composers = data;
              });
            });
          }, 1000);
        });
      }
    };

    $scope.contributors = {};
    $scope.$watch('contributors.interpret', function(name) {
      if (name!=='') {
        _api.contributorSuggesterCompletionGet(name).done(function(data) {
          $scope.$apply(function() {
            $scope.contributors.interprets = data;
          });
        });
      } else {
        $scope.contributors.interprets = [];
      }
    });
    $scope.$watch('contributors.lyricist', function(name) {
      if (name!=='') {
        _api.contributorSuggesterCompletionGet(name).done(function(data) {
          $scope.$apply(function() {
            $scope.contributors.lyricists = data;
          });
        });
      } else {
        $scope.contributors.lyricists = [];
      }
    });
    $scope.$watch('contributors.composer', function(name) {
      if (name!=='') {
        _api.contributorSuggesterCompletionGet(name).done(function(data) {
          $scope.$apply(function() {
            $scope.contributors.composers = data;
          });
        });
      } else {
        $scope.contributors.composers = [];
      }
    });

    $scope.$watch('rel', function(rel) {
      if (loaded) {
        setRelations(rel);
      }
    }, true);

    $scope.addBibleReference = function() {
      $scope.rel.bibles.splice(0,0, {
        time: $filter('_time')($scope.recorder)
      });
    };

    $scope.activateContributor = function(contributor, relation) {
      $scope.rel[relation+'s'].splice(0,0, {
        name: contributor.name,
        type: relation,
        id: contributor.id
      });
    };

    $scope.availableSongbooks = [
      'herrens_veier',
      'mandelblomsten'
    ];
    $scope.activateSongbook = function(_name) {
      $scope.rel.songbooks.splice(0,0, {
        id: 0,
        name: _name,
        type: 'songbook',
        timestamp: $filter('_time')(0)
      });
    };

    $scope.deleteReference = function(index, relations) {
      if (typeof index!=='undefined') {
        $scope.rel[relations].splice(index,1);
      }
    };

  });
