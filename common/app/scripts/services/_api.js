'use strict';

angular.module('bmmLibApp')
  .factory('_api', [ '$timeout', function ($timeout) {
  
  var factory = {},
      credentials = {},
      credentialsSuported = 'unresolved',
      imageCredentialsSuported = 'unresolved',
      keepAliveTime = 60000*10, //Default time = 10min
      serverUrl = 'https://localhost/', //Fallback
      requestTimeout;

  factory.setDefaults = function() {
    $.ajaxSetup({
      timeout: requestTimeout //Time in milliseconds
    });
  };
  factory.setDefaults();

  factory.serverUrl = function(url) {
    serverUrl = url;
  };

  factory.setKeepAliveTime = function(time) {
    keepAliveTime = time;
  };

  factory.setRequestTimeout = function(time) {
    requestTimeout = time;
    factory.setDefaults();
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
  }

  factory.getCredentials = function(encoded) {
    if (typeof encoded!=='undefined'&&encoded) {
      return encodeURIComponent(credentials.username)+':'+encodeURIComponent(credentials.password);
    } else {
      return credentials.username+':'+credentials.password;
    }
  }

  factory.getserverUrli = function() {
    return serverUrl;
  };

  /** Get the basic information about the API **/
  factory.root = function() {

    return $.ajax({
      method: 'GET',
      url: serverUrl,
      dataType: 'json',
      cache: false,
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Save a new album **/
  factory.albumPost = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'POST',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'album/',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get the latest albums of a specific type (Default is all types) **/
  factory.albumLatest = function(options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    return $.ajax({
      method: 'GET',
      url: serverUrl+'album/',
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get all albums in a year **/
  factory.albumPublishedYear = function(year, options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+
     *    from                      Integer         \d+
     *    content-type              Array(string)   song|speech|audiobook|singsong|video
     *    media-type                Array(string)   audio|video
     *    unpublished               string          hide|show|only
     */

    return $.ajax({
      method: 'GET',
      url: serverUrl+'album/published/'+year+'/',
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

    /** Get all albums in a year **/
  factory.albumTracksRecordedYear = function(year, options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+
     *    from                      Integer         \d+
     *    content-type              Array(string)   song|speech|audiobook|singsong|video
     *    media-type                Array(string)   audio|video
     *    unpublished               string          hide|show|only
     */

    return $.ajax({
      method: 'GET',
      url: serverUrl+'album/tracks_recorded/'+year+'/',
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a translated version of an album **/
  factory.albumGet = function(id, language, options) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

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

    return $.ajax({
      method: 'GET',
      url: serverUrl+'album/'+id,
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
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

    return $.ajax({
      method: 'PUT',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'album/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Delete an album **/
  factory.albumDelete = function(id) {

    return $.ajax({
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'album/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a list of years with albums for the archive (published sorting) **/
  factory.facetsAlbumPublishedYears = function(options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    /** OPTIONS (Stars = Required)
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    media-type                Array(String)   audio|video
     *    unpublished               String          hide|show|only
     */

    return $.ajax({
      method: 'GET',
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'facets/album_published/years',
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
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

    return $.ajax({
      method: 'GET',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'facets/track_recorded/years',
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Authenticate by username and password **/
  factory.loginAuthentication = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    /** OPTIONS (Stars = Required)
     *    username *                String
     *    password *                String
     */

    return $.ajax({
      method: 'POST',
      url: serverUrl+'login/authentication',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
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
  factory.search = function(term, options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+ Def = 20
     *    from                      Integer         \d+ Def = 0
     *    resource-type             Array(String)   album|track
     *    media-type                Array(String)   audio|video
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    unpublished               String          hide|show|only Role: ROLE_CONTENT_UNPUBLISHED
     */

    return $.ajax({
      method: 'GET',
      url: serverUrl+'search/'+term,
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Logout cookie session **/
  factory.logout = function() {

    return $.ajax({
      method: 'POST',
      url: serverUrl+'logout',
      crossDomain: true,
      xhrFields: {
        'withCredentials': true
      }
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a list of suggestions based on a given term **/
  factory.suggest = function(term, language) {

    if (typeof language === 'undefined') { language = ''; }

    return $.ajax({
      method: 'GET',
      url: serverUrl+'suggest/'+term,
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Save a new track **/
  factory.trackPost = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'POST',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'track/',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a list of the latest tracks in the library **/
  factory.trackLatest = function(options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+ Def = 20
     *    from                      Integer         \d+ Def = 0
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    media-type                Array(String)   audio|video
     *    unpublished               String          hide|show|only Role: ROLE_CONTENT_UNPUBLISHED
     *    tags                      Array(String)
     *    test credentials: steffan:f6f6f772748de54501aae49edcbd489a
     */

    return $.ajax({
      method: 'GET',
      url: serverUrl+'track/',
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a list of tracks related to what you asked for **/
  factory.trackRel = function(key, options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    /** OPTIONS (Stars = Required)
     *    size                      Integer         \d+ Def = 20
     *    from                      Integer         \d+ Def = 0
     *    content-type              Array(String)   song|speech|audiobook|singsong|video
     *    media-type                Array(String)   audio|video
     *    unpublished               String          hide|show|only Role: ROLE_CONTENT_UNPUBLISHED
     */

    return $.ajax({
      method: 'GET',
      url: serverUrl+'track/rel/'+key+'/',
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a translated version of a track **/
  factory.trackGet = function(id, language, options) {

    if (typeof language === 'undefined') { language = ''; }
    if (typeof options === 'undefined') { options = {}; }

    /** RETURNS
     *    Absolute file path
     */

    return $.ajax({
      method: 'GET',
      url: serverUrl+'track/'+id,
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Save a new track to existing album **/
  factory.trackPut = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'PUT',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'track/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Delete a track **/
  factory.trackDelete = function(id) {

    return $.ajax({
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'track/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Add a file to a track **/
  factory.trackFiles = function(id, type, file) {

    return $.ajax({
      method: 'POST',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'track/'+id+'/files/',
      file: file,
      dataType: 'json',
      data: JSON.stringify({
        type: type
      }),
      contentType: 'application/json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get the users profile **/
  factory.loginUser = function() {

    return $.ajax({
      method: 'GET',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'login/user',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      //factory.exceptionHandler(xhr); (Is handeled by the initializator)
    });

  };

  /** Accept track guessed for file, when file is uploaded through FTP **/
  factory.fileUploadedGuessTracksGet = function() {

    return $.ajax({
      method: 'GET',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'file/uploaded/guess_tracks',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Accept track guessed for file, when file is uploaded through FTP **/
  factory.fileUploadedNameLink = function(link, id, lang) {

    if (typeof lang === 'undefined') { return false; }

    return $.ajaxq('linking', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials()),
        'X-HTTP-METHOD-OVERRIDE': 'LINK'
      },
      url: serverUrl+'file/uploaded/'+link,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Link', '<'+serverUrl+'track/'+id+'>');
        xhr.setRequestHeader('Accept-Language', lang);
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a list of registered users (admins) **/
  factory.userGet = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'GET',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'user/',
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Contributor autocompletion search **/
  factory.userSuggesterCompletionGet = function(term, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'GET',
      url: serverUrl+'user/suggester/completion/'+term,
      data: $.param(options),
      dataType: 'json',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a user profile **/
  factory.userUsernameGet = function(username) {

    return $.ajax({
      method: 'GET',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'user/'+encodeURIComponent(username),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Update / create a user profile **/
  factory.userUsernamePut = function(username, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'PUT',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'user/'+encodeURIComponent(username),
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Delete a user profile **/
  factory.userUsernameDelete = function(username) {

    return $.ajax({
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'user/'+encodeURIComponent(username),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
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

    return $.ajax({
      method: 'POST',
      url: serverUrl+'track_collection/',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
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

    return $.ajax({
      method: 'POST',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials()),
        'X-HTTP-METHOD-OVERRIDE': 'LINK'
      },
      url: serverUrl+'track_collection/'+playlist,
      beforeSend: function (xhr) {
        var links = '';
        $.each(tracks, function() {
          links+='<'+serverUrl+'track/'+this+'>,';
        });
        xhr.setRequestHeader('Link', links);
        xhr.setRequestHeader('Accept-Language', language);
      },
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a collection **/
  factory.userTrackCollectionGet = function(id) {

    return $.ajax({
      method: 'GET',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'track_collection/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
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

    return $.ajax({
      method: 'PUT',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'track_collection/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Delete a collection **/
  factory.userTrackCollectionDelete = function(id) {

    return $.ajax({
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'track_collection/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Insert a contributor **/
  factory.contributorPost = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'POST',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'contributor/',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a contributor **/
  factory.contributorIdGet = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'GET',
      url: serverUrl+'contributor/'+id,
      xhrFields: {
        'withCredentials': true
      },
      data: $.param(options),
      dataType: 'json',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Contributor autocompletion search **/
  factory.contributorSuggesterCompletionGet = function(term, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'GET',
      url: serverUrl+'contributor/suggester/completion/'+term,
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Update a contributor **/
  factory.contributorIdPut = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'PUT',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'contributor/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Delete a contributor **/
  factory.contributorIdDelete = function(id) {

    return $.ajax({
      method: 'DELETE',
      headers: {
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      url: serverUrl+'contributor/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  /** Get a list of tracks from contributor **/
  factory.contributorTracksGet = function(id, options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    return $.ajax({
      method: 'GET',
      url: serverUrl+'contributor/'+id+'/track/',
      data: $.param(options),
      headers: {
        'Accept-Language': language,
        'Authorization': 'Basic '+window.btoa(factory.getCredentials())
      },
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {
      factory.exceptionHandler(xhr);
    });

  };

  return factory;

}]);