'use strict';

angular.module('bmmApp')
  .controller('MainCtrl', function (
    $scope,
    $timeout,
    $location,
    bmmApi,
    bmmTranslator,
    bmmFormatterTrack,
    bmmFormatterAlbum,
    bmmUser
  ) {

    $scope.$parent.contributors = false;

    //**//

    $scope._contributors = [];
    $scope.loading=false;
    $('.bmm-navigator-backend').off('scrollBottomContributors');
    var loadAmount = 80, end=false, loadFrom = 0;

    $('.bmm-navigator-backend').on('scrollBottomContributors', function() {
      loadContributors();
    });
    
    var loadContributors = function() {

      if (!end&&!$scope.loading) {

        $scope.loading=true;

        bmmApi.contributorGet({
          from: loadFrom,
          size: loadAmount
        }).done(function(contributors) {

          $scope.$apply(function() {
            var cnt = 0;
            $.each(contributors, function() {
              $scope._contributors.push(this);
              cnt++;
            });

            $scope.loading=false;

            if (cnt<loadAmount) {
              end=true;
            } else {
              loadFrom+=loadAmount;
            }
          });

        });

      }

    };

    loadContributors();


    //**//

    //Cache all translations in bmmUser
    var findMediaLanguage = function(lang, index) {
      if (typeof lang[index]==='undefined') {
        bmmUser.setMediaLanguage('nb'); //Fallback
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

    var findBibleTranslation = function(lang, index) {
      if (typeof lang[index]==='undefined') {
        lang[index] = 'nb'; //Fallback
      }

      $.ajax({
        url: 'translations/bible/'+lang[index]+'.json',
        error: function() {
          findBibleTranslation(lang, (index+1));
        },
        success: function(data) {
          bmmTranslator.setBible(data);
        }
      });
    };

    var setTagTranslation = function() {
      $.ajax({
        url: 'translations/tags/album.json',
        success: function(data) {
          bmmUser.setTagTranslation(data);
        }
      });
    };

    $scope.translation = {};

    bmmApi.loginUser().done(function(user) {
      
      $scope.trackCollections = user.track_collections;
      bmmUser.setUsername(user.username);
      bmmUser.setUser(user);

      bmmApi.root().done(function(root) {

        $scope.languages = root.languages; //Must set before findTrans..
        
        //Chache in bmmUser
        findTranslation(user.languages,0);
        findMediaLanguage(user.languages,0);
        findBibleTranslation(user.languages,0);
        setTagTranslation();

      });

    }).fail(function() {

      //If server adress for some reason was not set, set it before redirect
      if (bmmApi.getserverUrli==='localhost/') {
        bmmApi.serverUrl('https://devapibmm.brunstad.org/');
      }
      
      bmmApi.loginRedirect();

    });

    $scope.go = function ( path ) {
      $location.path( path );
    };

    $scope.addAlbum = function ( node ) {

      if (typeof node.roleId==='undefined') {
        node.roleId = null;
      }

      bmmApi.albumPost({
        parent_id: node.roleId,
        type: 'album',
        published_at: new Date().toISOString(),
        original_language: bmmUser.mediaLanguage,
        //is_visible: false, @todo - open when API is ready
        translations: [{
          language: bmmUser.mediaLanguage,
          title: node.title,
          is_visible: true
        }],
        cover_upload: null
      }).always(function(xhr) {
        
        if (xhr.status===201) {
          node.newAlbum = false;
          $scope.refreshArchive();
          $location.path( /album/+xhr.getResponseHeader('X-Document-Id') );
        }

      });
    };

    $scope.addTrack = function ( node ) {

      if (typeof node.roleId==='undefined') {
        node.roleId = null;
      }

      bmmApi.track({
        parent_id: node.roleId,
        is_visible: false,
        order: 0,
        type: 'track',
        subtype: 'speech',
        tags: [],
        recorded_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        original_language: bmmUser.mediaLanguage,
        translations: [{
          language: bmmUser.mediaLanguage,
          title: node.title,
          is_visible: true,
          media: []
        }],
        cover_upload: null,
        rel: []
      }).always(function(xhr) {
        
        if (xhr.status===201) {
          node.newTrack = false;

          if (typeof node.children==='undefined') {
            node.children = [];
          }

          node.children.push({
            roleName: node.title,
            roleId: xhr.getResponseHeader('X-Document-Id'),
            collapsed: true,
            group: 'track',
            loaded: false
          });

          $scope.newAlbum = '';
          $location.path( /track/+xhr.getResponseHeader('X-Document-Id') );
        }

      });
    };

    //FETCH ALL YEARS WHERE ALBUM EXISTS
    bmmApi.facetsAlbumPublishedYears({
      unpublished: 'show'
    }).done(function(data) {

      $scope.roleList = [];

      $.each(data, function() {

        $scope.roleList.push({
          roleName: this.year,
          roleId: this.year,
          collapsed: true,
          group: 'year',
          loaded: false
        });

      });

      $scope.roleList.reverse();
      makeDraggable();
      $scope.$apply();

    });

    //OPEN SELECTED TRACK / ALBUM
    $scope.$watch( 'tree.currentNode', function() {

      if( $scope.tree && angular.isObject($scope.tree.currentNode) ) {

        if ($scope.tree.currentNode.group==='album') {

          $location.path( '/album/'+$scope.tree.currentNode.roleId );

        } else if ($scope.tree.currentNode.group==='track') {

          $location.path( '/track/'+$scope.tree.currentNode.roleId );

        }

      }

    });

    //EXPAND ARCHIVE WITH NEW DATA
    $scope.$watch( 'tree.expandedNode', function() {

      if( $scope.tree && angular.isObject($scope.tree.expandedNode) ) {

        if ($scope.tree.expandedNode.group==='track') {
          $location.path( '/track/'+$scope.tree.expandedNode.roleId );
        } else if (!$scope.tree.expandedNode.loaded) {

          $scope.tree.expandedNode.loaded = true;

          //IF A YEAR IS OPENED, DISPLAY ALBUMS FOR THE WHOLE YEAR
          if ($scope.tree.expandedNode.group==='year') {

            bmmApi.albumPublishedYear($scope.tree.expandedNode.roleId, {
              unpublished: 'show'
            }).done(function(data) {

              $scope.tree.expandedNode.children = [];
              $.each(data, function() {

                var album = bmmFormatterAlbum.resolve(this);

                $scope.tree.expandedNode.children.push({
                  roleName: album.title,
                  roleId: album.id,
                  collapsed: true,
                  group: 'album',
                  loaded: false
                });

              });

              makeDraggable();
              $scope.$apply();

            });

          }

          //IF AN ALBUM IS OPENED, DISPLAY SUB ALBUMS AND TRACKS
          if ($scope.tree.expandedNode.group==='album') {
          
            bmmApi.albumGet( $scope.tree.expandedNode.roleId, bmmUser.mediaLanguage, {
              unpublished: 'show'
            }).done(function(data) {

              var albums = [], tracks = [];

              $.each(data.children, function() {

                if (typeof this.type!=='undefined') {
                  if (this.type==='album') {
                    albums.push(bmmFormatterAlbum.resolve(this));
                  } else if (this.type==='track') {
                    tracks.push(bmmFormatterTrack.resolve(this));
                  }
                }

              });

              $scope.tree.expandedNode.children = [];

              $.each(tracks, function() {

                $scope.tree.expandedNode.children.push({
                  roleName : this.combinedTitle,
                  roleId: this.id,
                  collapsed: true,
                  group: 'track',
                  loaded: false
                });

              });

              $.each(albums, function() {

                $scope.tree.expandedNode.children.push({
                  roleName : this.title,
                  roleId: this.id,
                  collapsed: true,
                  group: 'album',
                  loaded: false
                });

              });

              makeDraggable();
              $scope.$apply();

            });

          }

        }

      }
    }, false);

    $scope.refreshArchive = function() {

      //Save all folder ids that is expanded
      var expanded = {
        year: [],
        album: []
      };

      //Save all folder ids that is loaded
      var loaded = {
        year: [],
        album: []
      };

      //Find all expanded and loaded years/albums in archive
      var walkThrough = function(array) {
        $.each(array, function() {

          //Save if loaded
          if (this.loaded&&this.group!=='track') {
            loaded[this.group].push(this.roleId);

            //Save if expanded
            if (!this.collapsed&&this.group!=='track') {
              expanded[this.group].push(this.roleId);
            }

            //loop through its children
            if (typeof this.children!=='undefined') {
              walkThrough(this.children);
            }
          }

        });
      };

      //Start the walkThrough
      walkThrough($scope.roleList);

      //Expand a year
      var expandYear = function(node, year) {

        bmmApi.albumPublishedYear(year, {
          unpublished: 'show'
        }).done(function(data) {

          //For each album in year
          $.each(data, function() {

            var album = bmmFormatterAlbum.resolve(this);

            //If album has been loaded earlier
            if ($.inArray(this.id, loaded.album)!==-1) {

              var collapsed = true;
              //If album was expanded, expand again
              if ($.inArray(this.id, expanded.album)!==-1) {
                collapsed = false;
              }

              //Configure and make reference for the album
              var child = {
                roleName: album.title,
                roleId: this.id,
                collapsed: collapsed,
                group: this.type,
                loaded: true,
                children: []
              };

              //Render the loaded album
              node.push(child);
              //Load its children (send with reference)
              expandAlbum(child.children, this.id); //will child be referenced in next function?

            } else {
              //If it wasnt loaded before, keep it collapsed
              node.push({
                roleName: album.title,
                roleId: this.id,
                collapsed: true,
                group: this.type,
                loaded: false,
                children: []
              });
            }

          });

          $scope.$apply(function() {
            makeDraggable();
          });

        });

      };

      //Expand an album
      var expandAlbum = function(node, id) {

        bmmApi.albumGet(id, bmmUser.mediaLanguage, {
          unpublished: 'show'
        }).done(function(data) {

          //Sort album and tracks in different arrays
          var albums = [], tracks = [];
          $.each(data.children, function() {

            if (typeof this.type!=='undefined') {
              if (this.type==='album') {
                albums.push(bmmFormatterAlbum.resolve(this));
              } else if (this.type==='track') {
                tracks.push(bmmFormatterTrack.resolve(this));
              }
            }

          });

          //For each track in album
          $.each(tracks, function() {

            node.push({
              roleName : this.combinedTitle,
              roleId: this.id,
              collapsed: true,
              group: 'track',
              loaded: false
            });

          });

          //For each album in album
          $.each(albums, function() {

            //If it is an album and has been loaded earlier
            if (this.type==='album'&&$.inArray(this.id, loaded.album)!==-1) {

              var collapsed = true;

              //If album was expanded, expand again
              if ($.inArray(this.id, expanded.album)!==-1) {
                collapsed = false;
              }

              //Configure and make reference for the album
              var child = {
                roleName: this.title,
                roleId: this.id,
                collapsed: collapsed,
                group: 'album',
                loaded: true,
                children: []
              };

              //Render the loaded album
              node.push(child);
              //Load its children (send with reference)
              expandAlbum(child.children, this.id); //will child be referenced in next function?

            } else {
              //If it hasnt been loaded earlier, keep it collapsed
              node.push({
                roleName: this.title,
                roleId: this.id,
                collapsed: true,
                group: 'album',
                loaded: false,
                children: []
              });
            }

          });

          $scope.$apply(function() {
            makeDraggable();
          });

        });

      };

      //FETCH ALL YEARS WHERE ALBUM EXISTS
      bmmApi.facetsAlbumPublishedYears({
        unpublished: 'show'
      }).done(function(data) {

        $scope.roleList = [];
        $.each(data, function() {

          //If year has been loaded earlier
          if ($.inArray(this.year, loaded.year)!==-1) {

            var collapsed = true;
            //If year was expanded, expand again
            if ($.inArray(this.year, expanded.year)!==-1) {
              collapsed = false;
            }

            //Configure and make reference for the year
            var child = {
              roleName: this.year,
              roleId: this.year,
              collapsed: collapsed,
              group: 'year',
              loaded: true,
              children: []
            };

            //Render the loaded year
            $scope.roleList.push(child);
            //Load its children (send with reference)
            expandYear(child.children, this.year); //will child be referenced in next function?

          } else {
            //If it wasnt loaded before, keep it collapsed
            $scope.roleList.push({
              roleName: this.year,
              roleId: this.year,
              collapsed: true,
              group: 'year',
              loaded: false,
              children: []
            });
          }

        });

        $scope.roleList.reverse();
        makeDraggable();
        $scope.$apply();

      });

    };

    var makeDraggable = function() {

      $timeout(function() {

        var a,b,c; //Quickfix for wrong y-position while scrolling
        $('.admin-draggable').draggable({
          handle: '>span',
          helper: 'clone',
          appendTo: '.bmm-container-main',
          revert: 'invalid',
          scope: 'move',
          zIndex: '1000',
          scroll: true,
          cursorAt: {
            left: 20,
            top: 2+$('.bmm-container-main').scrollTop()
          },
          start: function(e,ui) {
            a = ui.position.top;
            b = $('.bmm-container-main').scrollTop();
            c = e.pageY;
          },
          drag: function(e,ui) {
            ui.position.top = a+$('.bmm-container-main').scrollTop()-b+e.pageY-c;
          }
        });

        $('body').find('.admin-droppable >span').droppable({
          scope: 'move',
          activeClass: 'active',
          hoverClass: 'hover',
          tolerance: 'pointer',
          drop: function(ev, ui) {

            var dropId = Number($(this).parent().attr('id'));
            if ($(this).parent().attr('type')==='year') {
              var year = dropId;
              dropId = null;
            }

            if (ui.draggable.attr('type')==='album') {

              bmmApi.albumGet(
                //Album id defined in path
                ui.draggable.attr('id'),
                bmmUser.mediaLanguage,
                { raw: true } //Get raw data (all as is)
              ).done(function(album) {

                delete album._meta;
                delete album.id;
                delete album.show_in_listing;
                album.parent_id = dropId;

                if (dropId===null) {
                  album.published_at = album.published_at.substring(4);
                  album.published_at = year + album.published_at;
                }

                bmmApi.albumPut(ui.draggable.attr('id'), album).done(function() {

                  $scope.refreshArchive();

                });

              });

            } else if (dropId!==null) {

              bmmApi.trackGet(
                //Album id defined in path
                ui.draggable.attr('id'),
                bmmUser.mediaLanguage,
                { raw: true } //Get raw data (all as is)
              ).done(function(track) {

                delete track._meta;
                delete track.id;
                track.parent_id = dropId;

                bmmApi.trackPut(ui.draggable.attr('id'), track).done(function() {

                  $scope.refreshArchive();

                });

              });

            } else {
              alert('Tracks må ligge i et album');
            }

          }
        });

      }, 200);

    };

  });
