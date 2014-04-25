'use strict';

angular.module('bmmApp')
  .controller('WelcomeCtrl', function ($scope, $timeout, bmmApi, bmmRelation) {
    
    $scope.$parent.contributors = false;
    
    //LATEST SPEECHS (WORKS)
    bmmApi.trackLatest({
      size: 10,
      'content-type[]': 'speech',
      'media-type[]': 'audio'
    }).done(function(data) {

      var left = [],
          right = [],
          interprets,
          title,
          names;

      $.each(data, function(index) {

        title = this._meta.parent.title;
        interprets = bmmRelation.filter(this.rel, 'interpret');
        $.each(interprets, function(index) {
          if (interprets.length===1) {
            names = this.name;
          } else {
            if (index===(interprets.length-1)) {
              names+='og ' + this.name;
            } else if (index===(interprets.length-2)) {
              names+=this.name+' ';
            } else {
              names+=this.name+', ';
            }
          }
        });

        if (index<5) {
          left.push({title: title, interpret: names, about: ''});
        } else {
          right.push({title: title, interpret: names, about: ''});
        }

      });

      $scope.$apply(function() {
        $scope.latestSpeaksLeft = left;
        $scope.latestSpeaksRight = right;
      });

    });

    //LATEST VIDEO
    bmmApi.trackLatest({
      size: 5,
      //'content-type[]': 'video', @todo - wait for videos
      'media-type[]': 'audio'
    }).done(function(data) {

      var videos = [],
          title;

      $.each(data, function() {

        title = this._meta.parent.title;

        videos.push({title: title, id: this.id});

      });

      $scope.$apply(function() {
        $scope.latestVideos = videos;
      });

    });

    //LATEST SPEECHS (WORKS)
    bmmApi.trackLatest({
      size: 6,
      //'content-type[]': 'song', @todo - wait for tracks
      //'content-type[]': 'audiobook', @todo - make work as normal array
      'media-type[]': 'audio'
    }).done(function(data) {

      var left = [],
          right = [],
          interprets,
          title,
          names;

      $.each(data, function(index) {

        title = this._meta.parent.title;
        interprets = bmmRelation.filter(this.rel, 'interpret');
        $.each(interprets, function(index) {
          if (interprets.length===1) {
            names = this.name;
          } else {
            if (index===(interprets.length-1)) {
              names+='og ' + this.name;
            } else if (index===(interprets.length-2)) {
              names+=this.name+' ';
            } else {
              names+=this.name+', ';
            }
          }
        });

        if (index<3) {
          left.push({title: title, interpret: names, about: ''});
        } else {
          right.push({title: title, interpret: names, about: ''});
        }

      });

      $scope.$apply(function() {
        $scope.latestMusicLeft = left;
        $scope.latestMusicRight = right;
      });

    });

    //LATEST AUDIO ALBUMS
    bmmApi.albumLatest({
      size: 20,
      //'content-type[]': 'song', - $todo - wait for data, then open
      //'content-type[]': 'audiobook', @todo - make work as normal array
      'media-type[]': 'audio'
    }).done(function(data) {

      var albums=[];

      $.each(data, function() {

        albums.push({cover: this.cover});

      });

      $scope.$apply(function() {
        $scope.latestAlbums = albums;
        $timeout(function() {
          $(window).trigger('resize');
        });
      });

    });

  });
