'use strict';

angular.module('bmmLibApp')
  .filter('_time', function () {
    return function (input) {

      var convertTime = function(ss) {

          var hh=0,
              mm=0;
          
          if (typeof ss==='undefined') {
            ss = 0;
          }

          ss=parseInt(ss, 10);
          
          while (ss>=60) {

            if (ss>=60*60) {
              hh+=1;
              ss-=60*60;
            } else {
              mm+=1;
              ss-=60;
            }

          }

          if (hh<=9) { hh = '0'+hh; }
          if (mm<=9) { mm = '0'+mm; }
          if (ss<=9) { ss = '0'+ss; }

          if (hh==='00') { hh = ''; } else { hh = hh+':'; }
          mm = mm+':';
          if (hh&&mm&&ss===0) { ss = ''; }
          
          return hh+mm+ss;
            
        };

      return convertTime(input);
      
    };
  });