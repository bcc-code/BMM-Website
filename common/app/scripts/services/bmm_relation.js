'use strict';

angular.module('bmmLibApp')
  .factory('bmmRelation', [function () {
    
    var factory = {};

    factory.filter = function(array, filter) {

      //Check if filter is defined
      if (typeof filter==='undefined' || filter==='' || filter===[]) {
        return false;
      } else {

        var newArray = [], relation = [];

        //Search trough all relations
        $.each(array, function() {

          relation = this;

          //If multiple filters
          if ($.isArray(filter)) {
            $.each(filter, function() {

              //Check if relation.type equals any filter
              if (relation.type===this) {
                newArray.push(relation); //If it does, add to array
              }

            });
          } else {

            //If single filter and relation.type is equal
            if (relation.type===filter) {
              newArray.push(relation); //Add to array
            }

          }

        });

        return newArray; //Return filtered relations

      }

    };

    return factory;

  }]);