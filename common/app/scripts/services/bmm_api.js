'use strict';

angular.module('bmmLibApp')
  .factory('bmmApi', [function () {
  
  var factory = {},
      serverUrli = 'localhost/';

  factory.serverUrl = function(url) {
    serverUrli = url;
  };

  factory.getserverUrli = function() {
    return serverUrli;
  };

  /** Get the basic information about the API **/
  factory.root = function() {

    return $.ajax({
      method: 'GET',
      crossDomain: true,
      url: serverUrli,
      dataType: 'json'
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Save a new album **/
  factory.albumPost = function(options) {
    
    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'POST',
      url: serverUrli+'album/',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Get the latest albums of a specific type (Default is all types) **/
  factory.albumLatest = function(options, language) {
    
    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    return $.ajax({
      method: 'GET',
      url: serverUrli+'album/',
      headers: {
        'Accept-Language': language
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'album/published/'+year+'/',
      headers: {
        'Accept-Language': language
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'album/tracks_recorded/'+year+'/',
      headers: {
        'Accept-Language': language
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'album/'+id,
      headers: {
        'Accept-Language': language
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'album/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Delete an album **/
  factory.albumDelete = function(id) {

    return $.ajax({
      method: 'DELETE',
      url: serverUrli+'album/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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

    return $.ajax({
      method: 'GET',
      url: serverUrli+'facets/album_published/years',
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'facets/track_recorded/years',
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'login/authentication',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Authenticates the user by redirecting him to the Sherwood SignOn Server **/
  factory.loginRedirect = function() {

    window.location = serverUrli+'login/redirect?redirect_to='+window.location;

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
      url: serverUrli+'search/'+term,
      headers: {
        'Accept-Language': language
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Get a list of suggestions based on a given term **/
  factory.suggest = function(term, language) {

    if (typeof language === 'undefined') { language = ''; }

    return $.ajax({
      method: 'GET',
      url: serverUrli+'suggest/'+term,
      headers: {
        'Accept-Language': language
      },
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Save a new track **/
  factory.track = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'POST',
      url: serverUrli+'track/',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
     */

    return $.ajax({
      method: 'GET',
      url: serverUrli+'track/',
      headers: {
        'Accept-Language': language
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'track/rel/'+key+'/',
      headers: {
        'Accept-Language': language
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'track/'+id,
      headers: {
        'Accept-Language': language
      },
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Save a new track to existing album **/
  factory.trackPut = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'PUT',
      url: serverUrli+'track/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Delete a track **/
  factory.trackDelete = function(id) {

    return $.ajax({
      method: 'DELETE',
      url: serverUrli+'track/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Add a file to a track **/
  factory.trackFiles = function(id, type, file) {

    return $.ajax({
      method: 'POST',
      url: serverUrli+'track/'+id+'/files/',
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

      //console.log(xhr);

    });

  };

  /** Get the users profile **/
  factory.loginUser = function() {

    return $.ajax({
      method: 'GET',
      url: serverUrli+'login/user',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      //console.log(xhr);

    });

  };

  /** Accept track guessed for file, when file is uploaded through FTP **/
  factory.fileUploadedGuessTracksGet = function() {

    return $.ajax({
      method: 'GET',
      url: serverUrli+'file/uploaded/guess_tracks',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function() {

      //console.log(xhr);

    });

  };

  /** Accept track guessed for file, when file is uploaded through FTP **/
  factory.fileUploadedNameLink = function(name, track) {

    if (typeof track.language === 'undefined') { return false; }

    return $.ajax({
      method: 'POST',
      url: serverUrli+'file/uploaded/'+name+'?_method=LINK',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Link', '<'+serverUrli+'track/'+track.id+'>');
        xhr.setRequestHeader('Accept-Language', track.language);
      },
      crossDomain: true
    }).fail( function() {

      //console.log(xhr);

    });

  };

  /** Get a list of registered users (admins) **/
  factory.userGet = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'GET',
      url: serverUrli+'user/',
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      //console.log(xhr);

    });

  };

  /** Get a user profile **/
  factory.userUsernameGet = function(username) {

    return $.ajax({
      method: 'GET',
      url: serverUrli+'user/'+username,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      //console.log(xhr);

    });

  };

  /** Update / create a user profile **/
  factory.userUsernamePut = function(username, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'PUT',
      url: serverUrli+'user/'+username,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      //console.log(xhr);

    });

  };

  /** Delete a user profile **/
  factory.userUsernameDelete = function(username) {

    return $.ajax({
      method: 'DELETE',
      url: serverUrli+'user/'+username,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      //console.log(xhr);

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
      url: serverUrli+'track_collection/',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function() {

      //console.log(xhr);

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
      url: serverUrli+'track_collection/'+playlist+'?_method=LINK',
      beforeSend: function (xhr) {
        $.each(tracks, function() {
          //@todo - Find a solution for multiple Link requests
          xhr.setRequestHeader('Link', '<'+serverUrli+'track/'+this+'>');
        });
        xhr.setRequestHeader('Accept-Language', language);
      },
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function() {

      //console.log(xhr);

    });

  };

  /** Get a collection **/
  factory.userTrackCollectionGet = function(id) {

    return $.ajax({
      method: 'GET',
      url: serverUrli+'track_collection/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

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
      url: serverUrli+'track_collection/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function() {

      //console.log(xhr);

    });

  };

  /** Delete a collection **/
  factory.userTrackCollectionDelete = function(id) {

    return $.ajax({
      method: 'DELETE',
      url: serverUrli+'track_collection/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function() {

      //console.log(xhr);

    });

  };

  /** Get a list of contributors **/
  factory.contributorGet = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'GET',
      url: serverUrli+'contributor/',
      data: $.param(options),
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Insert a contributor **/
  factory.contributorPost = function(options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'POST',
      url: serverUrli+'contributor/',
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Get a contributor **/
  factory.contributorIdGet = function(id, language) {

    if (typeof language === 'undefined') { language = ''; }

    return $.ajax({
      method: 'GET',
      url: serverUrli+'contributor/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      headers: {
        'Accept-Language': language
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Update a contributor **/
  factory.contributorIdPut = function(id, options) {

    if (typeof options === 'undefined') { options = {}; }

    return $.ajax({
      method: 'PUT',
      url: serverUrli+'contributor/'+id,
      data: JSON.stringify(options),
      contentType: 'application/json',
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Delete a contributor **/
  factory.contributorIdDelete = function(id) {

    return $.ajax({
      method: 'DELETE',
      url: serverUrli+'contributor/'+id,
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  /** Get a list of tracks from contributor **/
  factory.contributorTracksGet = function(id, options, language) {

    if (typeof options === 'undefined') { options = {}; }
    if (typeof language === 'undefined') { language = ''; }

    return $.ajax({
      method: 'GET',
      url: serverUrli+'contributor/'+id+'/track/',
      data: $.param(options),
      headers: {
        'Accept-Language': language
      },
      dataType: 'json',
      xhrFields: {
        'withCredentials': true
      },
      crossDomain: true
    }).fail( function(xhr) {

      console.log(xhr);

    });

  };

  return factory;

}]);