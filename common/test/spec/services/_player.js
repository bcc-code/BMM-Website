'use strict';

describe('Service: _player', function () {

  // load the service's module
  beforeEach(module('bmmLibApp'));

  // instantiate service
  var _player;
  beforeEach(inject(function (__player_) {
    _player = __player_;
  }));

  it('should do something', function () {
    //expect(!!_player).toBe(true);
  });

});
