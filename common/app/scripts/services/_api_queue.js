'use strict';
angular.module('bmmLibApp')
  .factory('_api_queue', [function () {
    var factory = {};


    factory.pendingRequests = [];
    factory.awaitingModifying = [];
    factory.awaitingGet = [];

    //this should be set to a function that takes requestOptions as one argument
    //it should also return a promise, that resolves when the request is finished.
    factory.requestExecutor = null;

    //execute request and add it to the pendingRequests array.
    factory.executeRequest = function(requestOptions) {
      var request = factory.requestExecutor(requestOptions);
      factory.pendingRequests.push(request);

      request.always(function() {
        if(requestOptions.promise) {
          //This is another promise that is used because the promise
          //is created before the request. Just resolve/reject the earlier
          //promise when the newer promise is resolved/rejected
          if(requestOptions.isResolved()) {
            //If resolved call the resolve method.
            requestOptions.promise.resolve.apply(requestOptions.promise, arguments);
          } else {
            //If the request was rejected, call the reject method
            requestOptions.promise.reject.apply(requestOptions.promise, arguments);
          }
        }
        //When a request is done (or failed) remove it from the pendingRequests queue.
        var index = factory.pendingRequests.indexOf(request);
        factory.pendingRequests.splice(index, 1);
      });

      return request;
    };

    factory.STATUS_GET = 1;
    //Status when trying to switch from STATUS_GET to STATUS_MODIFYING
    factory.STATUS_SWITCHING = 2;
    factory.STATUS_MODIFYING = 3;

    //Begin with STATUS_GET
    factory.status = factory.STATUS_GET;

  /**
   * runRequestsSequentially is used to run requests one after another with no overlapping.
   * This is useful for modifying requests, where multiple simultaneous requests may cause an
   * invalid state on the server side.
   * @param  {Array} requests  An array of xhrOptions objects, to be executed as XHR's
   * @return {Promise}         A promise that is resolved when all the requests are finished, even the new ones added while the queue is in progress, are taken into account here.
   */
    factory.runRequestsSequentially = function(requests) {
      var q = $.Deferred();

    var handleNextRequest = function() {
      if(requests.length > 0) {
        var request = requests[0];
        requests.splice(0, 1);
        factory.executeRequest(request).always(handleNextRequest);
      } else {
        q.resolve();
      }
    };

    handleNextRequest();

      return q.promise();
    };

    /**
     * This function is used for flushing the queue when the requests don't have to be executed sequentially.
     */
    factory.runRequests = function(requests) {
      requests.forEach(function(request) {
        factory.executeRequest(request);
    });

      while(requests.length) {
        requests.pop();
      }
    };

    factory.addModifyingRequest = function(requestOptions) {
      requestOptions.promise = $.Deferred();
      factory.awaitingModifying.push(requestOptions);
      if(factory.status === factory.STATUS_GET) {
        factory.status = factory.STATUS_SWITCHING;
        $.when(factory.pendingRequests).always(function() {
          factory.status = factory.STATUS_MODIFYING;
          factory.runRequestsSequentially(factory.awaitingModifying)
          .always(function() {
            factory.status = factory.STATUS_GET;
            factory.runRequests(factory.awaitingGet);
          });
        });
      }

      return requestOptions.promise;
    };

    factory.addGetRequest = function(requestOptions) {
      if(factory.status === factory.STATUS_GET) {
        return factory.executeRequest(requestOptions);
      } else {
        factory.awaitingGet.push(requestOptions);
        requestOptions.promise = $.Deferred();
        return requestOptions.promise;
      }
    };

    //the requestOptions object should have been run through _api.prepareRequest or
    //something equivalent.
    factory.addRequest = function(requestOptions) {
      if(requestOptions.method === 'GET') {
        return factory.addGetRequest(requestOptions);
      } else {
        return factory.addModifyingRequest(requestOptions);
      }
    };

    return factory;

  }]);