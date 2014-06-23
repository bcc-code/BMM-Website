'use strict';

angular.module('bmmLibApp')
  .factory('quickMenu', function () {

    var factory = {};

    factory.menu = {};
    factory.menu.reRender = 0;
    factory.setMenu = function(_year, _rootId, _parentId) {

      if (typeof factory.menu.year!=='undefined'&&
          (factory.menu.year===_year&&
          factory.menu.rootId===_rootId&&
          factory.menu.parentId===_parentId)) {
        return false;
      }

      if (_rootId===null&&typeof _parentId!=='undefined') {
        _rootId = _parentId;
        _parentId = null;
      }

      if (typeof _year!=='undefined') {
        if (typeof _rootId!=='undefined') {
          if (typeof _parentId!=='undefined'&&_parentId!==null&&_rootId!==_parentId) {
            factory.menu = {
              year: _year,
              rootId: _rootId,
              parentId: _parentId,
              reRender: factory.menu.reRender
            }
          } else {
            factory.menu = {
              year: _year,
              rootId: _rootId,
              parentId: false,
              reRender: factory.menu.reRender
            }
          }
        } else {
          factory.menu = {
            year: _year,
            rootId: false,
            parentId: false,
            reRender: factory.menu.reRender
          }
        }
      }

    };

    factory.refresh = function() {
      factory.menu.reRender = (factory.menu.reRender+1);
    };

    return factory;

  });
