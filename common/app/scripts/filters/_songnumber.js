'use strict';

angular.module('bmmLibApp')
  .filter('_songnumber', function () {
    return function (track) {

      if (track.relations && track.relations.songbook) {
        var relation = track.relations.songbook[0];
        if (relation.name === 'herrens_veier') {
          return "HV " + relation.id;
        } else if (relation.name === 'mandelblomsten') {
          return "FMB " + relation.id;
        } else {
          return relation.name + " " + relation.id;
        }
      }

      return "";
    };
  });
