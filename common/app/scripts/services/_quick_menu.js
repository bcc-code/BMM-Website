'use strict';

angular.module('bmmLibApp')
  .factory('_quickMenu', ['_api', '_track', '_album', '_init', function (_api, _track, _album, _init) {

    var factory = {};

    factory.menu = {};
    factory.menu.reRender = 0;
    factory.setMenu = function(_year, _albumRootId, _albumParentId) {

      if (typeof factory.menu.year!=='undefined'&&(
          factory.menu.year===_year&&
          factory.menu.albumRootId===_albumRootId&&
          factory.menu.albumParentId===_albumParentId)) {
        return false;
      }

      if (_albumRootId===null&&typeof _albumParentId!=='undefined') {
        _albumRootId = _albumParentId;
        _albumParentId = null;
      }

      if (typeof _year!=='undefined') {
        if (typeof _albumRootId!=='undefined') {
          if (typeof _albumParentId!=='undefined'&&_albumParentId!==null&&_albumRootId!==_albumParentId) {
            factory.menu = {
              year: _year,
              albumRootId: _albumRootId,
              albumParentId: _albumParentId,
              reRender: factory.menu.reRender
            }
          } else {
            factory.menu = {
              year: _year,
              albumRootId: _albumRootId,
              albumParentId: false,
              reRender: factory.menu.reRender
            }
          }
        } else {
          factory.menu = {
            year: _year,
            albumRootId: false,
            albumParentId: false,
            reRender: factory.menu.reRender
          }
        }
      }

    };

    factory.refresh = function() {
      factory.menu.reRender = (factory.menu.reRender+1);
    };

    //FETCH YEARS
    factory.years = [];
    _api.facetsAlbumPublishedYears({
      unpublished: 'show'
    }).done(function(years) {

      factory.year = [];
      factory.years = [];
      factory.tracks = [];
      factory.childAlbums = [];
      factory.childTracks = [];
      $.each(years, function() {
        factory.years.push(this.year);
      });
      factory.years.reverse();

    });

    //FETCH ALBUMS
    factory.albums = [];
    factory.findAlbums = function(year, options) {
      _api.albumPublishedYear(year, {
        unpublished: 'show'
      }, _init.contentLanguage).done(function(albums) {

        factory.albums = [];
        factory.tracks = [];
        factory.childAlbums = [];
        factory.childTracks = [];
        $.each(albums, function() {
          var album = _album.resolve(this);
          factory.albums.push(album);
        });
        factory.albums.reverse();

        if (typeof options!=='undefined') {
          options.done();
        };

      });
    };

    //FETCH TRACKS
    factory.tracks = [];
    factory.findTracks = function(id) {
      _api.albumGet(id, _init.contentLanguage, {
        unpublished: 'show'
      }).done(function(data) {

        factory.track = [];
        factory.tracks = [];
        $.each(data.children, function() {
          if (typeof this.type!=='undefined'&&this.type==='track') {
            factory.tracks.push(_track.resolve(this));
          }
        });

      });
    };

    //FETCH CHILD-ALBUMS
    factory.childAlbums = [];
    factory.findChildAlbums = function(id, options) {
      _api.albumGet(id, _init.contentLanguage, {
        unpublished: 'show'
      }).done(function(data) {

        factory.childAlbum = [];
        factory.childAlbums = [];
        factory.childTracks = [];
        $.each(data.children, function() {
          if (typeof this.type!=='undefined'&&this.type==='album') {
            var album = _album.resolve(this);
            factory.childAlbums.push(album);
          }
        });
        factory.childAlbums.reverse();

        if (typeof options!=='undefined') {
          options.done();
        };

      });
    };

    //FETCH CHILD-TRACKS
    factory.childTracks = [];
    factory.findChildTracks = function(id) {
      _api.albumGet(id, _init.contentLanguage, {
        unpublished: 'show'
      }).done(function(data) {

        factory.childTrack = [];
        factory.childTracks = [];
        $.each(data.children, function() {
          if (typeof this.type!=='undefined'&&this.type==='track') {
            factory.childTracks.push(_track.resolve(this));
          }
        });

      });
    };

    //AUTOOPEN QUICK MENU
    factory.autoOpen = function(year, albumRootId, albumParentId) {

      factory.year = year

      factory.findAlbums(year, {
        done: function() {

          $.each(factory.albums, function() {
            if (this.id === albumRootId) {
              factory.album = this;
              return false;
            }
          });

          factory.findTracks(albumRootId);

          factory.findChildAlbums(albumRootId, {
            done: function() {

              if (typeof albumParentId!=='undefined') {

                $.each(factory.childAlbums, function() {
                  if (this.id === albumParentId) {
                    factory.albumChild = this;
                    return false;
                  }
                });

                factory.findChildTracks(albumParentId);

              }

            }
          });

        }
      })

    };

    return factory;

  }]);
