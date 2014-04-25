'use strict';

angular.module('bmmLibApp')
  .directive('bmmPath', ['$location', '$compile', function ($location, $compile) {
    return {
      compile : function() {
        return {
          pre : function(scope, element) {

            //PRESET
            element.addClass('bmm-path');

            var path = $location.path().split('/'),
                relativePath = '',
                str;
            
            $.each(path, function(index) {

              str = firstToUpperCase(this);
              relativePath+=this+'/';

              if (index===(path.length-1)&&index!==1) {
                element.append('<div class="bmm-pointer"> > </div>'+str);
              } else if (index===(path.length-1)) {
                element.append(str);
              } else if (index===1) {
                element.append('<a ng-href="#'+relativePath+'">'+str+'</a>');
              } else if (index>1) {
                element.append('<div class="bmm-pointer"> > </div><a ng-href="#'+relativePath+'">'+str+'</a>');
              }

            });

            $compile(element.contents())(scope);

            function firstToUpperCase(str) {
              str = str.replace(':','');
              return str.substr(0, 1).toUpperCase()+str.substr(1);
            }

          }
        };
      }
    };
  }]);