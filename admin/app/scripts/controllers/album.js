'use strict';

angular.module('bmmApp')
  .controller('AlbumCtrl', function ($scope, $filter, $location, $rootScope, $routeParams, $timeout, bmmApi, bmmUser) {

    $scope.$parent.contributors = false;

    var changes = false,
        languageSelected,
        albumGlobal = {};

    //Save album
    $scope.save = function(options) {

      var translations = [];

      //Inform user that saving is in progress
      $scope.information = 'Vent litt...';
      $scope.tempSave();

      //Copy translations into a format that is expected by API
      $.each($scope.translations, function() {

        //Push data in correct format
        translations.push({
          language: this.language,
          title: this.title,
          description: this.description,
          is_visible: this.is_visible
        });

      });

      //Send data to server
      bmmApi.albumPut(albumGlobal.id, {

        parent_id: albumGlobal.parent_id,
        tags: $scope.tags,
        type: albumGlobal.type,
        bmm_id: $scope.bmmId,
        published_at: $scope.datePublished,
        original_language: $scope.originalLanguage,
        translations: translations,
        cover: $scope.cover/*,
        is_visible: ($scope.published==='true') @todo - open when api is ready */

      }).done(function() {

        //Inform user that album is saved
        $scope.information = 'Albumet er lagret!';
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

      }).fail(function(xhr) {

        //Inform user that album could not be saved
        $scope.information = 'Beklager, kunne ikke lagre - Feilmelding: (Se console)';
        console.log(xhr);
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

    //Add tags
    $scope.tagSuggestions = [
      'Parents\' and Couples Conference',
      'Childrens\' Conference',
      'Sisters\' Conference',
      'Sisters\' Meeting',
      'Sisters\' Feast',
      'Brothers\' Feast',
      'Brothers\' Conference',
      'Brothers\' Conference Grenland',
      'Brothers\' Meeting',
      'Youth Conference',
      'Youth Meeting',
      'BrunstadTV',
      'Brunstadfeast',
      'Feast Meeting',
      'Fellowship-Weekend',
      'Conference',
      'Summer Conference',
      'Summer Conference July',
      'Summer Conference August',
      'Easter Conference',
      'Bible Competition',
      'New Year Conference',
      'Pentecostal Conference',
      'Feast',
      'child-favorites',
      'instrumental',
      'mp3-kilden',
      'Meeting',
      'Mission Meeting',
      'Opening'
    ];
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

    //Generate title based on tags
    $scope.generateTitles = function() {

      var translation = bmmUser.getTagTranslation();

      $.each($scope.tags, function() {
        var tag = this;
        if (typeof translation[tag]!=='undefined') {
          $.each($scope.translations, function() {

            if (typeof translation[tag][this.language]!=='undefined') {
              this.title = translation[tag][this.language];

              if ($scope.language === this.language) {
                $scope.title = translation[tag][this.language];
                if (tag==='Meeting') {
                  $scope.title+=' '+$filter('date')($scope.datePublished,'dd.MM - HH:mm');
                } else {
                  $scope.title+=' '+$filter('date')($scope.datePublished,'yyyy');
                }
              }

              if (tag==='Meeting') {
                this.title+=' '+$filter('date')($scope.datePublished,'dd.MM - HH:mm');
              } else {
                this.title+=' '+$filter('date')($scope.datePublished,'yyyy');
              }

            }

          });
        }

      });

      $scope.save();

    };

    //Remove cover image
    $scope.removeCover = function() {
      $scope.cover = null;
      $scope.coverImage = null;
      $scope.save();
    };

    //Delete the whole album with all its content
    $scope.delete = function() {
      if (confirm(
        '***ADVARSEL!*** Vil du virkelig slette '+
        'hele albumet med alle dets oversettelser '+
        'og media filer?'
      )) {
        bmmApi.albumDelete(albumGlobal.id).always(function() {
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
          this.description = $scope.description;
          return false;
        }
      });

    };

    //Change original language to another language
    $scope.setOriginal = function() {

      //Set selected language as the new original language
      $.each($scope.translations, function() {
        this.name = this.language;
        if (this.language===$scope.language) {
          $scope.originalLanguage = this.language;
          $scope.title = this.title;
          this.name = this.name+' (original)';
          $scope.visible = String(this.is_visible);
          $scope.description = this.description;
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
          $scope.description = this.description;
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

    //Load album from server
    var loadAlbum = function() {

      //Store translated and available languages in separate lists
      $scope.translations = [];
      $scope.availables = [];

      //Get root data which contains languages available
      bmmApi.root().done(function(root) {

        //Get album
        bmmApi.albumGet(
          //Album id defined in path
          $routeParams.id,
          '', //language doesnt need to be defined when raw
          {
            raw: true //Get raw data (all as is)
          }
        ).done(function(album) {

            albumGlobal = album;

            //Make list of translated languages
            var i = 0, translatedList = [];
            $.each(album.translations, function() {
              
              if (typeof(this.is_visible)==='undefined') {
                this.is_visible = false;
              }

              //Add translation to translated list
              translatedList.push(this.language);

              //When original language occur
              if (this.language===album.original_language) {
                
                languageSelected = this.language;

                //Append translation to scope
                $scope.translations.push({
                  //Used for selection options
                  name: this.language+' (original)', //Users view
                  value: this.language, //Option value
                  //Below is a copy of data from 'this'
                  language: this.language,
                  title: this.title,
                  description: this.description,
                  is_visible: this.is_visible
                });

                //Set title
                $scope.title = this.title;

                //Set description
                $scope.description = this.description;

                //Set original language
                $scope.originalLanguage = this.language;

                //Set original language as selected
                $scope.language = $scope.translations[i].value;

                //Set selected language published state
                $scope.visible = String(this.is_visible);

                //Disable remove and 'set as original' for original
                $scope.languageDisableEdit = true;

              } else {
                //Translations as option in scope
                $scope.translations.push({
                  //Used for selection options
                  name: this.language, //Users view
                  value: this.language, //Option value
                  //Below is a copy of data from 'this'
                  language: this.language,
                  title: this.title,
                  description: this.description,
                  is_visible: this.is_visible
                });
              }

              i++;

            });

            //Published?
            $scope.published = String(album.show_in_listing);

            //Tags
            $scope.tags = album.tags;

            //Set cover
            $scope.cover = album.cover;
            if ($scope.cover!==null) {
              $scope.coverImage = bmmApi.getserverUrli()+'album/'+$routeParams.id+'/cover';
            } else {
              $scope.coverImage = null;
            }

            //Set BMM ID
            if (album.bmm_id!==null) {
              $scope.bmmId = album.bmm_id;
            }

            //Set published date
            if (album.published_at!==null) {
              $scope.datePublished = new Date(album.published_at);
            }

            //Languages not translated
            i=0;
            $.each(root.languages, function() {

              if ($.inArray(this,translatedList)===-1) {
                $scope.availables.push({
                  //Used for selection options
                  name: this, //Users view
                  value: this, //Option value
                  //Below is a copy of data from 'this'
                  language: this,
                  title: '',
                  description: '',
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

    //Load album on page load
    loadAlbum();
    
  });