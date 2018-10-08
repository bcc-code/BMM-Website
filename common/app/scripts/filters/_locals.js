'use strict';

angular.module('bmmLibApp')
  .filter('_locals', function (_locals, $filter) {
    return function (date, lang, out) {

      if (typeof date!=='undefined') {

        date = new Date(date);
        // We add the timezone offset + UTC+2 of Norway's timezone
        date = new Date(date.getTime() + date.getTimezoneOffset()*60000 + 120*60000);

        var local='', wd = date.getDay();

        var d = function(str) {
          return $filter('date')(date, str);//$locale.formatDate(new Date(date), str);
        };

        if (typeof _locals.getAll().date[lang]==='undefined') {
          lang = 'nb'; //Fallback
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
