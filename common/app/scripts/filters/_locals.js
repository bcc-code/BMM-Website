'use strict';

angular.module('bmmLibApp')
  .filter('_locals', function (_locals, $filter, _session) {

    var msInOneMinute = 60000;

    Date.prototype.stdTimezoneOffset = function () {
      var jan = new Date(this.getFullYear(), 0, 1);
      var jul = new Date(this.getFullYear(), 6, 1);
      return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }
    Date.prototype.getNorwegianTimezoneOffset = function () {
      var offsetFromUtcInMinutes;
      if (this.getTimezoneOffset() < this.stdTimezoneOffset()){
        offsetFromUtcInMinutes = 120; // summer time
      } else {
        offsetFromUtcInMinutes = 60; // winter time
      }
      return this.getTimezoneOffset() + offsetFromUtcInMinutes;
    }

    var convertToTimeInNorway = function(dateString) {
      var localDate = new Date(dateString);
      return new Date(localDate.getTime() + localDate.getNorwegianTimezoneOffset() * msInOneMinute);
    }

    return function (dateString, lang, out) {

      if (typeof dateString!=='undefined') {

        // This filter shows the time in the norwegian timezone
        // On the website we use this filter everywhere date-related. 
        // On the admin panel we don't use this filter at all and show times in the local timezone
        var date = convertToTimeInNorway(dateString);

        var local='', wd = date.getDay();

        var d = function(str) {
          return $filter('date')(date, str);//$locale.formatDate(new Date(date), str);
        };

        if (typeof _locals.getAll().date[lang]==='undefined') {
          lang = _session.current.websiteLanguage; // Fallback
        }
        
        if (typeof _locals.getAll().date[lang].output!=='undefined') {

          local = _locals.getAll().date[lang];
          if (typeof out==='undefined') {
            out = _locals.getAll().date[lang].output;
          }

          var repl = function(target, translated) {
            out = out.replace(target, translated);
          };

          repl('{a}', d('a'));
          repl('AM', local.am);
          repl('PM', local.pm);
          repl('{SHORTDAY}', local.SHORTDAY[wd]);
          repl('{SHORTMONTH}', local.SHORTMONTH[d('M')-1]);
          repl('{yyyy}', d('yyyy'));
          repl('{yy}', d('yy'));
          repl('{y}', d('y'));
          repl('{MMMM}', d('MMMM'));
          repl('{MMM}', d('MMM'));
          repl('{M}', d('M'));
          repl('{dd}', d('dd'));
          repl('{d}', d('d'));
          repl('{EEEE}', d('EEEE'));
          repl('{EEE}', d('EEE'));
          repl('{HH}', d('HH'));
          repl('{H}', d('H'));
          repl('{hh}', d('hh'));
          repl('{h}', d('h'));
          repl('{mm}', d('mm'));
          repl('{m}', d('m'));
          repl('{ss}', d('ss'));
          repl('{s}', d('s'));
          repl('{.sss}', d('.sss'));
          repl('{,sss}', d(',sss'));
          repl('{Z}', d('Z'));
          repl('{ww}', d('ww'));
          repl('{w}', d('w'));
          repl('{y}', d('y'));

        }

      } else {
        out = '';
      }

      return out;
    };
  });
