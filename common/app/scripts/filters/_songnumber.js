'use strict';

angular.module('bmmLibApp')
  .filter('_songnumber', function () {
    return function (track) {

      if (track.relations && track.relations.songbook) {
        var relation = track.relations.songbook[0];
        if (relation.name === 'herrens_veier') {
          return "HV " + relation.id;
        } else {
          return "FMB " + relation.id;
        }
      }

      return "";
    };
  });