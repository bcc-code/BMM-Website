'use strict';

angular.module('bmmLibApp')
  .factory('_api', [ '$timeout', '_api_queue', function ($timeout, _api_queue) {
  
  var factory = {},
      credentials = {},
      credentialsSuported = 'unresolved',
      //imageCredentialsSupported = 'unresolved',
      keepAliveTime = 60000*10, //Default time = 10min
      serverUrl = 'https://localhost/', //Fallback
      requestTimeout,
      contentLanguages = [];

  //This variable indicates whether the "unknown" language ("zxx", used for non-lingual content)
  //should be appended with every request by default.
  factory.appendUnknownLanguage = false; //Fallback to false

  factory.serverUrl = function(url) {
    serverUrl = url;
  };

  factory.prepareRequest = function(customXhrOptions) {
    var xhrOptions, defaultXhrOptions, supportedMethods;

    //The default options for every request
    defaultXhrOptions = {
      crossDomain: true,
      dataType: 'json',
      timeout: requestTimeout,
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials()),
        //Add this to all requests, because if we don't add this header, the browser will
        //add one with it's own languages. It will not harm to leave it here for all the requests,
        //even though it's not required.
        'Accept-Language': contentLanguages
      },
      xhrFields: {
        'withCredentials': true
      }
    };

    function merge(obj1,obj2){ // Custom merge function
        var result = {}; // return result
        for(var i in obj1){      // for every property in obj1 
            if((i in obj2) && (typeof obj1[i] === 'object') && (i !== null) && !$.isArray(obj1[i])){

              //Arrays are not merged, they're treated like any other primitive property.
              //This is because of the Accept-Languages property.

                result[i] = merge(obj1[i],obj2[i]); // if it's an object, merge   
            } else {
               result[i] = obj1[i]; // add it to result
            }
        }
        for(i in obj2){ // add the remaining properties from object 2
            if(i in result){ //conflict
                continue; //obj1 has higher priority, therefore skip.
            }
            result[i] = obj2[i];
        }
        return result;
    }


    //copy all the properties from the customXhrOptions to the xhrOptions
    //So that the xhrOptions object acts as a default/fallback
    xhrOptions = merge(customXhrOptions, defaultXhrOptions);

    //require an url
    if(typeof xhrOptions.url !== 'string') {
      throw new Error('Cannot create a request without an URL');
    }

    //link is not supported by Firefox, so not adding it here.
    //Firefox issue with LINK is fixed, and the method is therefore supported.
    //Only the methods needed by the BMM-API are supported...
    supportedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'LINK'];

    //require a method, don't default to GET.
    //This should be supplied with every request.
    if(typeof xhrOptions.method !== 'string' || supportedMethods.indexOf(xhrOptions.method) === -1) {
      throw new Error('The HTTP method: ' + xhrOptions.method + ' is not supported');
    }
    
    //Check if the language code for non-lingual content should be appended to the languages array.
    if(factory.appendUnknownLanguage && xhrOptions.headers) {
      var languages = xhrOptions.headers['Accept-Language'];
      //Only append the language if the languages is an array.
      if($.isArray(languages)) {
        xhrOptions.headers['Accept-Language'] = languages.concat(['zxx', 'ar']);
      }
    }

    return xhrOptions;
  };

  factory.addToQueue = function(customXhrOptions) {
    var xhrOptions = factory.prepareRequest(customXhrOptions);
    return _api_queue.addRequest(xhrOptions);
  };

  /**
   * Send an XHR request with some special defined defaults and requirements.
   * @param  {object} customXhrOptions        And Object with custom properties that override the default. Same object as jQuery ajax
   * @param  {function|boolean} errorHandler  Either a boolean (false) indicating that there should be no errorHeandler
   * @return {xhrPromise}                     Returns the jqXHR instance that is returned by $.ajax()
   */
  factory.sendXHR = function(customXhrOptions, errorHandler) {
    
    var xhrOptions = factory.prepareRequest(customXhrOptions);

    errorHandler = errorHandler || factory.exceptionHandler;

    var promise = $.ajax(xhrOptions);
    //If errorHandler == false or anything but a function, no errorHandler should be used.
    if(typeof errorHandler === 'function') {
      promise.fail(errorHandler);
    }

    return promise;
  };

  //decorate requestExecutor of the _api_queue with
  //the factory.sendXHR method.
  _api_queue.requestExecutor = factory.sendXHR;

  factory.getserverUrli = function() {
    return serverUrl;
  };

  factory.setKeepAliveTime = function(time) {
    keepAliveTime = time;
  };

  factory.setRequestTimeout = function(time) {
    requestTimeout = time;
  };

  factory.exceptionHandler = function(xhr) {
    if (xhr.status===401) {
      factory.loginRedirect();
    }
  };
    
  factory.keepAlive = function() {
    $timeout(function() {
      factory.loginUser().done(function() {
        factory.keepAlive();
      });
    }, keepAliveTime);
  };

  //Doesnt need to be secured
  factory.secureDownload = function(download, force) {
    if (typeof force!=='undefined'&&force) {
      return download;//factory.secureFile(download);
    } else {
      return download;
    }
  };

  //Doesnt need to be secured
  factory.secureImage = function(image) {
    return image;
  };

  factory.getPodcastHash = function(path) {

    var md5 = $.md5(credentials.username+'\n'+path).substring(0,10);
    return encodeURIComponent(credentials.username+'|'+credentials.password+'|'+md5);

  };

  factory.secureFile = function(file) {

    //Is credentials supported by browser? Else cookies is automatically used
    if (credentialsSuported==='unresolved') {
      var el = document.createElement('img');
      try {
        el.src = factory.getserverUrli().replace('://','://'+factory.getCredentials(true)+'@');
        if (el.src) {
          credentialsSuported = true;
          //Logout session (cookies not needed)
          //factory.logout();
        } else {
          credentialsSuported = false;
        }
        factory.keepAlive();
      }
      catch(err) {
        credentialsSuported = false;
        factory.keepAlive();
      }
    }

    if (credentialsSuported) {
      return file.replace('://','://'+factory.getCredentials(true)+'@');
    } else {
      return file;
    }

  };

  factory.setCredentials = function(user, pass) {
    credentials = {
      username: user,
      password: pass
    };
  };

  factory.getCredentials = function(encoded) {
    if (typeof encoded!=='undefined'&&encoded) {
      return encodeURIComponent(credentials.username)+':'+encodeURIComponent(credentials.password);
    } else {
      return credentials.username+':'+credentials.password;
    }
  };

  factory.setContentLanguages = function(languages) {
    contentLanguages = languages;
  };

  factory.getContentLanguages = function() {
    return contentLanguages || '';
  };

  /** Get the basic information about the API **/
  factory.root = function() {

    return _api_queue.addRequest({
      method: 'GET',
      url: serverUrl,
      cache: false,
      //No xhrFields, override default
      xhrFields: {}
    });

  };

  /** Save a new album **/
  factory.albumPost = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'POST',
      url: serverUrl+'album/',
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Get the latest albums of a specific type (Default is all types) **/
  factory.albumLatest = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'album/',
      data: $.param(options)
    });

  };

  /** Get all albums in a year **/
  factory.albumPublishedYear = function(year, options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+
     *    from                      Integer         \d+
     *    content-type              Array(string)   song|speech|audiobook|singsong|video
     *    media-type                Array(string)   audio|video
     *    unpublished               string          hide|show|only
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'album/published/'+year+'/',
      data: $.param(options)
    });

  };

    /** Get all albums in a year **/
  factory.albumTracksRecordedYear = function(year, options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+
     *    from                      Integer         \d+
     *    content-type              Array(string)   song|speech|audiobook|singsong|video
     *    media-type                Array(string)   audio|video
     *    unpublished               string          hide|show|only
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'album/tracks_recorded/'+year+'/',
      data: $.param(options)
    });

  };

  /** Get a translated version of an album **/
  factory.albumGet = function(id, options, languages) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    raw                       Boolean         Role: ROLE_ALBUM_MANAGER
     */

    /** RETURNS
     *    id                        Integer
     *    parent_id                 Integer
     *    type                      String
     *    description               String
     *    created_at                datetime        ISO 8601
     *    ended_at                  datetime        ISO 8601
     *    started_at                datetime        ISO 8601
     *    original_languages        String          ISO 639-1 || ISO 639-3
     *    translations [{           Array(objects)
     *      language: '',           string          ISO 639-1 || ISO 639-3
     *      title: ''               String
     *    }]
     *    show_in_listing *         Boolean
     *    show_in_library *         Boolean
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'album/'+id,
      data: $.param(options),
      headers: {
        'Accept-Language': languages,
      }
    });

  };

  /** Save an album **/
  factory.albumPut = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    parent_id *               Integer         Can also be NULL
     *    started_at *              datetime        ISO 8601
     *    ended_at *                datetime        ISO 8601
     *    original_language *       String          ISO 639-1 || ISO 639-3
     *    translations [{           Array(objects)
     *      language: '',           string          ISO 639-1 || ISO 639-3
     *      title: ''               String
     *    }]
     *    cover *                   String
     *    show_in_listing *         Boolean
     *    show_in_library *         Boolean
     *    type                      String          Always 'album'
     *    description               String
     */

    return factory.addToQueue({
      method: 'PUT',
      url: serverUrl+'album/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Delete an album **/
  factory.albumDelete = function(id) {

    return factory.addToQueue({
      method: 'DELETE',
      url: serverUrl+'album/'+id
    });

  };

  /** Get a list of years with albums for the archive (published sorting) **/
  factory.facetsAlbumPublishedYears = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    media-type                Array(String)   audio|video
     *    unpublished               String          hide|show|only
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'facets/album_published/years',
      data: $.param(options)
    });

  };

  /** Get a list of years with tracks for the archive (recorded sorting) **/
  factory.facetsTrackRecordedYears = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    media-type                Array(String)   audio|video
     *    unpublished               String          hide|show|only
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'facets/track_recorded/years',
      data: $.param(options)
    });

  };

  /** Authenticate by username and password **/
  factory.loginAuthentication = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    username *                String
     *    password *                String
     */

    return factory.addToQueue({
      method: 'POST',
      url: serverUrl+'login/authentication',
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Authenticates the user by redirecting him to the Sherwood SignOn Server **/
  factory.loginRedirect = function(options) {

    var loginUrl = serverUrl+'login/redirect?redirect_to='+window.location;
    var iframe = '<iframe style="width: 0; height: 0; visibility: hidden;"'+
                 'id="login" src="'+loginUrl+'"></iframe>',
        loaded = false;

    $('body').append(iframe);

    //Login success
    $('#login').load(function () {
      loaded = true;
      if (typeof options !=='undefined') {
        options.done();
      }
    });

    //Login failed
    $timeout(function() {
      if (!loaded) {
        if (typeof options !=='undefined') {
          options.fail(loginUrl);
        } else {
          window.location = loginUrl;
        }
      }
    }, 3000);

  };

  /** Get a list of the data **/
  factory.search = function(term, options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+ Def = 20
     *    from                      Integer         \d+ Def = 0
     *    resource-type             Array(String)   album|track
     *    media-type                Array(String)   audio|video
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    unpublished               String          hide|show|only Role: ROLE_CONTENT_UNPUBLISHED
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'search/'+term,
      data: $.param(options)
    });

  };

  /** Logout cookie session **/
  factory.logout = function() {

    return factory.addToQueue({
      method: 'POST',
      url: serverUrl+'logout',
      dataType: 'text'
    });

  };

  /** Get a list of suggestions based on a given term **/
  factory.suggest = function(term) {

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'suggest/'+term
    });

  };

  /** Save a new track **/
  factory.trackPost = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'POST',
      url: serverUrl+'track/',
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Get a list of the latest tracks in the library **/
  factory.trackLatest = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+ Def = 20
     *    from                      Integer         \d+ Def = 0
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    media-type                Array(String)   audio|video
     *    unpublished               String          hide|show|only Role: ROLE_CONTENT_UNPUBLISHED
     *    tags                      Array(String)
     *    test credentials: steffan:f6f6f772748de54501aae49edcbd489a
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'track/',
      data: $.param(options)
    });

  };

  /** Get a list of tracks related to what you asked for **/
  factory.trackRel = function(key, options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+ Def = 20
     *    from                      Integer         \d+ Def = 0
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    media-type                Array(String)   audio|video
     *    unpublished               String          hide|show|only Role: ROLE_CONTENT_UNPUBLISHED
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'track/rel/'+key+'/',
      data: $.param(options)
    });

  };

  /** Get a translated version of a track **/
  factory.trackGet = function(id, options, languages) {

    if (typeof options === 'undefined') { options = {}; }

    /** RETURNS
     *    Absolute file path
     */

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'track/'+id,
      data: $.param(options),
      headers: {
        'Accept-Language': languages
      }
    });

  };

  /** Save a new track to existing album **/
  factory.trackPut = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'PUT',

      url: serverUrl+'track/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Delete a track **/
  factory.trackDelete = function(id) {

    return factory.addToQueue({
      method: 'DELETE',
      url: serverUrl+'track/'+id
    });

  };

  /** Add a file to a track **/
  factory.trackFiles = function(id, type, file) {

    return factory.addToQueue({
      method: 'POST',
      url: serverUrl+'track/'+id+'/files/',
      file: file,
      data: JSON.stringify({
        type: type
      }),
      contentType: 'application/json'
    });

  };

  /** Get the users profile **/
  factory.loginUser = function() {

    return factory.sendXHR({
      method: 'GET',
      url: serverUrl+'login/user'
    }, false);
    //Errors are handeled by the initializator, therefore no errorHandler, (second argument false)

  };

  /** Accept track guessed for file, when file is uploaded through FTP **/
  factory.fileUploadedGuessTracksGet = function() {

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'file/uploaded/guess_tracks'
    });

  };

  /** Accept track guessed for file, when file is uploaded through FTP **/
  factory.fileUploadedNameLink = function(link, id, lang) {

    if (typeof lang === 'undefined') { return false; }
    //Here was ajaxq used instead of ajax before, not totally sure why :/ May cause bugs!
    return factory.addToQueue({
      method: 'POST',
      headers: {
        'Link': '</track/'+id+'>',
        'Accept-Language': lang,
        'X-HTTP-METHOD-OVERRIDE': 'LINK'
      },
      url: serverUrl+'file/uploaded/'+link
    });

  };

  /** Get a list of registered users (admins) **/
  factory.userGet = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'user/',
      data: $.param(options)
    });

  };

  /** Contributor autocompletion search **/
  factory.userSuggesterCompletionGet = function(term, options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'user/suggester/completion/'+term,
      data: $.param(options)
    });

  };

  /** Get a user profile **/
  factory.userUsernameGet = function(username) {

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'user/'+encodeURIComponent(username)
    });

  };

  /** Update / create a user profile **/
  factory.userUsernamePut = function(username, options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'PUT',
      url: serverUrl+'user/'+encodeURIComponent(username),
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Delete a user profile **/
  factory.userUsernameDelete = function(username) {

    return factory.addToQueue({
      method: 'DELETE',
      url: serverUrl+'user/'+encodeURIComponent(username)
    });

  };

  /** Add a track, and PUT it again **/
  factory.userTrackCollectionPost = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    /** headers
     *    'Accept-Language':        String          ISO 639-1 || ISO 639-3
     *    'Link':                   <url1> <- Currently not working with multiple
     *    'Link':                   <url2> <- last will be used
     */

    return factory.addToQueue({
      method: 'POST',
      url: serverUrl+'track_collection/',
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Add a track, and PUT it again **/
  factory.userTrackCollectionLink = function(playlist, tracks, language) {

    if (typeof tracks === 'undefined') { tracks = {}; }

    /** headers
     *    'Accept-Language':        String          ISO 639-1 || ISO 639-3
     *    'Link':                   <url1> <- Currently not working with multiple
     *    'Link':                   <url2> <- last will be used
     */

    return factory.addToQueue({
      method: 'POST',
      headers: {
        'Accept-Language': language,
        'X-HTTP-METHOD-OVERRIDE': 'LINK'
      },
      url: serverUrl+'track_collection/'+playlist,
      beforeSend: function (xhr) {
        var links = '';
        $.each(tracks, function() {
          links+='</track/'+this+'>,';
        });
        xhr.setRequestHeader('Link', links);
      }
    });

  };

  /** Get a collection **/
  factory.userTrackCollectionGet = function(id) {

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'track_collection/'+id
    });

  };

  /** Add to collection **/
  factory.userTrackCollectionPut = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    type                      String          Always 'track_collection'
     *    track_references [{ *
     *      id: int, *              Integer
     *      language: '', *         String          ISO 639-1 || ISO 639-3
     *    }]
     */

    options.type = 'track_collection';

    return factory.addToQueue({
      method: 'PUT',
      url: serverUrl+'track_collection/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Delete a collection **/
  factory.userTrackCollectionDelete = function(id) {

    return factory.addToQueue({
      method: 'DELETE',
      url: serverUrl+'track_collection/'+id
    });

  };

  /** Insert a contributor **/
  factory.contributorPost = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'POST',
      url: serverUrl+'contributor/',
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Get a contributor **/
  factory.contributorIdGet = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'contributor/'+id
    });

  };

  /** Contributor autocompletion search **/
  factory.contributorSuggesterCompletionGet = function(term, options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'contributor/suggester/completion/'+term,
      data: $.param(options)
    });

  };

  /** Update a contributor **/
  factory.contributorIdPut = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'PUT',
      url: serverUrl+'contributor/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json'
    });

  };

  /** Delete a contributor **/
  factory.contributorIdDelete = function(id) {

    return factory.addToQueue({
      method: 'DELETE',
      url: serverUrl+'contributor/'+id
    });

  };

  /** Get a list of tracks from contributor **/
  factory.contributorTracksGet = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return factory.addToQueue({
      method: 'GET',
      url: serverUrl+'contributor/'+id+'/track/',
      data: $.param(options)
    });

  };

  /** Move a language within a track **/
  factory.changeTrackLanguagePost = function(id, fromLanguage, toLanguage) {

    return factory.addToQueue({
      method: 'POST',
      url: serverUrl+'track/'+id+'/'+fromLanguage+'/changeTo/'+toLanguage
    });
  };



  return factory;

}]);