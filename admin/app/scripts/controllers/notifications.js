'use strict';

angular.module('bmmApp')
  .controller('NotificationsCtrl', function(
    _api
  ) {
    var vm = this;

    vm.sortableOptions = {
      axis: 'y',
      'ui-floating': false
    };
  });