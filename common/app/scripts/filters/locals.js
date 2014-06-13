'use strict';

angular.module('bmmLibApp')
  .filter('locals', ['locals', '$filter', function (locals, $filter) {
    return function (date, lang, out) {

      date = new Date(date);

      var local='', wd = date.getDay();

      var d = function(str) {
        return $filter('date')(date, str);//$locale.formatDate(new Date(date), str);
      };

      if (typeof locals.getAll().date[lang]==='undefined') {
        lang = 'nb'; //Fallback
      }

      if (typeof locals.getAll().date[lang].output!=='undefined') {

        local = locals.getAll().date[lang];
        if (typeof out==='undefined') {
          out = locals.getAll().date[lang].output;
        }

        out = out.replace('{a}', d('a'));
        out = out.replace('AM', local.am);
        out = out.replace('PM', local.pm);
        out = out.replace('{SHORTDAY}', local.SHORTDAY[wd]);
        out = out.replace('{SHORTMONTH}', local.SHORTMONTH[d('M')-1]);
        out = out.replace('{yyyy}', d('yyyy'));
        out = out.replace('{yy}', d('yy'));
        out = out.replace('{y}', d('y'));
        out = out.replace('{MMMM}', d('MMMM'));
        out = out.replace('{MMM}', d('MMM'));
        out = out.replace('{M}', d('M'));
        out = out.replace('{dd}', d('dd'));
        out = out.replace('{d}', d('d'));
        out = out.replace('{EEEE}', d('EEEE'));
        out = out.replace('{EEE}', d('EEE'));
        out = out.replace('{HH}', d('HH'));
        out = out.replace('{H}', d('H'));
        out = out.replace('{hh}', d('hh'));
        out = out.replace('{h}', d('h'));
        out = out.replace('{mm}', d('mm'));
        out = out.replace('{m}', d('m'));
        out = out.replace('{ss}', d('ss'));
        out = out.replace('{s}', d('s'));
        out = out.replace('{.sss}', d('.sss'));
        out = out.replace('{,sss}', d(',sss'));
        out = out.replace('{Z}', d('Z'));
        out = out.replace('{ww}', d('ww'));
        out = out.replace('{w}', d('w'));
        out = out.replace('{y}', d('y'));
      }

      return out;
    };
  }]);
