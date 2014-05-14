'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $timeout,
    $location,
    $route,
    bmmApi,
    bmmPlaylist,
    bmmPlayer,
    bmmUser,
    bmmPlay,
    bmmFormatterAlbum,
    draggable
    ) {

    $scope.loadEnd = false;

    //Check for iphone / ipod / ipad
    var ipad = (navigator.userAgent.match(/iPad/i) !== null);
    var iphone = (navigator.userAgent.match(/iPhone/i) !== null);
    var ipod = (navigator.userAgent.match(/iPod/i) !== null);

    if (ipad||iphone||ipod) {
      $scope.ios = true;
    } else {
      $scope.ios = false;
    }

    $scope.setMediaLanguage = function(lang) {
      bmmUser.setMediaLanguage(lang);
      $scope.mediaLanguage = bmmUser.mediaLanguage;
      $route.reload();
    };

    var findMediaLanguage = function(lang, index) {
      if (typeof lang[index]==='undefined') {
        bmmUser.setMediaLanguage('nb');
      }

      if (!bmmUser.mediaLanguageIsSet()&&$.inArray(lang[index],$scope.languages)!==-1) {
        bmmUser.setMediaLanguage(lang[index]);
        $scope.mediaLanguage = bmmUser.mediaLanguage;
      } else if (!bmmUser.mediaLanguageIsSet()) {
        findMediaLanguage(lang, index+1);
      }
    };

    var findTranslation = function(lang, index) {
      if (typeof lang[index]==='undefined') {
        lang[index] = 'nb'; //Fallback
      }

      $.ajax({
        url: 'translations/'+lang[index]+'.json',
        error: function() {
          findTranslation(lang, (index+1));
        },
        success: function(data) {
          $scope.$apply(function() {
            $scope.translation = data;
            bmmUser.setTranslation(data);
          });
        }
      });
    };

    var fetchTags = function() {
      $.ajax({
        url: 'translations/tags/album.json',
        success: function(data) {
          bmmUser.addTags('album', data);
        }
      });
    };

    $('.bmm-view').off('scrollBottom');

    $scope.translation = {};

    bmmApi.loginUser().done(function(user) {

      $scope.trackCollections = user.track_collections;
      bmmUser.setUsername(user.username);
      bmmUser.setUser(user);
      bmmApi.setCredentials(bmmUser.getUser().username, bmmUser.getUser().token);

      bmmApi.root().done(function(root) {

        //Temporary remove arabic (@todo - remove later)
        $.each(root.languages, function(index) {
          if (this==='ar') {
            root.languages.splice(index,1);
          }
        });

        $scope.$apply(function() {
          $scope.languages = root.languages; //Must set before findTrans..
          findTranslation(user.languages,0);
          findMediaLanguage(user.languages,0);
          fetchTags();
          $scope.loadEnd = true;
        });

      });

    }).fail(function() {

      bmmApi.loginRedirect();

    });

    $scope.go = function ( path ) {
      $location.path( path );
    };

    $scope.play = function(playlist, index) {
      bmmPlay.setPlay(playlist, index);
    };

    //FETCH YEARS
    $scope.years = [];
    bmmApi.facetsAlbumPublishedYears({
      unpublished: 'show'
    }).done(function(years) {

      $scope.$apply(function() {
        $scope.year = [];
        $scope.years = [];
        $.each(years, function() {
          $scope.years.push(this.year);
        });
        $scope.years.reverse();
      });

    });

    //FETCH ALBUMS
    $scope.albums = [];
    $scope.findAlbums = function(year) {
      bmmApi.albumPublishedYear(year, {
        unpublished: 'show'
      }, bmmUser.mediaLanguage).done(function(albums) {

        $scope.$apply(function() {
          $scope.album = [];
          $scope.albums = [];
          $.each(albums, function() {
            var album = bmmFormatterAlbum.resolve(this);
            $scope.albums.push(album);
          });
          $scope.albums.reverse();
        });

      });
    };

    //FETCH CHILD-ALBUMS
    $scope.childAlbums = [];
    $scope.findChildAlbums = function(id) {
      bmmApi.albumGet(id, bmmUser.mediaLanguage, {
        unpublished: 'show'
      }).done(function(data) {

        $scope.$apply(function() {
          $scope.childAlbum = [];
          $scope.childAlbums = [];
          $.each(data.children, function() {
            if (typeof this.type!=='undefined'&&this.type==='album') {
              $scope.childAlbums.push(bmmFormatterAlbum.resolve(this));
            }
          });
          $scope.albums.reverse();
        });

      });
    };

    $(window).bind('scroll', function() {
      if($(window).scrollTop() + $(window).height()>=$(document).height()) {
        $(window).trigger('scrollBottom');
      }
    });

  });
