'use strict';

angular.module('bmmApp')
  .controller('TransmissionsCtrl', function(
    $scope,
    $routeParams,
    _api,
    _init
  ) {
  $scope.init = _init;

  var date = new Date();
  var defaultTitle = 'Møte – 11:00';
  var defaultStartDate = date.setHours(11, 0, 0);
  var defaultEndDate = date.setHours(13, 0, 0);

  var defaultTransmission = {
    title: defaultTitle,
    start: defaultStartDate,
    end: defaultEndDate,
    type: 'transmission'
  };

  $scope.initNewTransmission = function() {
    $scope.transmission = defaultTransmission;
  };

  function doneLoading() {
    $scope.loading = false;
  }

  function init() {
    $scope.loading = true;
    $scope.initNewTransmission();

    _api.transmissionsGet().then(function(transmissions) {
      $scope.transmissions = transmissions;
    })

    .then(function(){
      doneLoading();
    })

    .fail(function() {
      doneLoading();
    });
  };
  init();  

  $scope.saveTransmission = function() {
    var transmissionId = $scope.transmission.id;
    var transmission = angular.copy($scope.transmission);

    if(transmissionId) {
      delete transmission.id;
      _api.transmissionIdPut(transmissionId, transmission)
        .then(function() {
          var index = $scope.transmissions.indexOf(transmission);
          $scope.transmissions[index] = transmission;
          $scope.transmissions.sort(byDate);
        });
    } else {
      _api.transmissionPost(transmission)
        .done(function(insertedTransmission) {
          $scope.transmissions.push(JSON.parse(insertedTransmission));
          $scope.transmissions.sort(byDate);
        });
    }
  }

  $scope.editTransmission = function(transmission) {
    $scope.transmission = transmission;
    $scope.mainVisible = true;
  };

  $scope.deleteTransmission = function(transmission) {
    _api.transmissionIdDelete(transmission.id)
      .then(function() {
        var index = $scope.transmissions.indexOf(transmission);
        $scope.transmissions.splice(index, 1);
      });
  };

  $scope.updateTransmissionEnd = function(startDate) {
    var newStartDate = new Date(startDate);
    $scope.transmission.end = newStartDate.setHours(newStartDate.getHours() + 2);
  }

  function byDate(a, b) {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
}
});
