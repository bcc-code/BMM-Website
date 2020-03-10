'use strict';

var NgOidcClient;
(function (NgOidcClient) {
    angular.module('ng.oidcclient', []);
    NgOidcClient.getModule = function () {
        return angular.module("ng.oidcclient");
    };
})(NgOidcClient || (NgOidcClient = {}));

(function (NgOidcClient) {
    "use strict";
    var app = NgOidcClient.getModule();
    var NgOidcClientProvider = (function () {
        function NgOidcClientProvider() {
            this.settings = null;
            this.mgr = null;
            this.userInfo = {
                user: null,
                isAuthenticated: false
            };
            this.urls = [];
            this.$get.$inject = ['$q', '$rootScope'];
        }
        NgOidcClientProvider.prototype.setSettings = function (options) {
            this.settings = options;
        };
        NgOidcClientProvider.prototype.setUrls = function (options) {
            this.urls = options;
        };
        NgOidcClientProvider.prototype.$get = function ($q, $rootScope) {
            var _this = this;
            //$log.log("NgOidcClient service started");
            if (!this.settings)
                throw Error('NgOidcUserService: Must call setSettings() with the required options.');
            //Oidc.Log.logger = console;
            //Oidc.Log.logLevel = Oidc.Log.INFO;
            this.mgr = new Oidc.UserManager(this.settings);
            var notifyUserInfoChangedEvent = function () {
                $rootScope.$broadcast('ng-oidc-client.userInfoChanged');
            };
            this.mgr.events.addUserLoaded(function (u) {
                _this.userInfo.user = u;
                _this.userInfo.isAuthenticated = true;
                $rootScope.$broadcast('ng-oidc-client.userLoaded', u);
                notifyUserInfoChangedEvent();
            });
            this.mgr.events.addUserUnloaded(function () {
                _this.userInfo.user = null;
                _this.userInfo.isAuthenticated = false;
                $rootScope.$broadcast('ng-oidc-client.userUnloaded');
                notifyUserInfoChangedEvent();
            });
            this.mgr.events.addAccessTokenExpiring(function () {
                $rootScope.$broadcast('ng-oidc-client.accessTokenExpiring');
            });
            this.mgr.events.addAccessTokenExpired(function () {
                _this.userInfo.user = null;
                _this.userInfo.isAuthenticated = false;
                $rootScope.$broadcast('ng-oidc-client.accessTokenExpired');
                notifyUserInfoChangedEvent();
            });
            this.mgr.events.addSilentRenewError(function (e) {
                _this.userInfo.user = null;
                _this.userInfo.isAuthenticated = false;
                $rootScope.$broadcast('ng-oidc-client.silentRenewError');
                notifyUserInfoChangedEvent();
            });
            var signinPopup = function (args) {
                return _this.mgr.signinPopup(args);
            };
            var signinRedirect = function (args) {
                return _this.mgr.signinRedirect(args);
            };
            var signoutPopup = function (args) {
                return _this.mgr.signoutPopup(args);
            };
            var signoutRedirect = function (args) {
                return _this.mgr.signoutRedirect(args);
            };
            var getUrls = function () {
                return _this.urls;
            };
            var getUserInfo = function () {
                return _this.userInfo;
            };
            var userInfoChanged = function (scope, callback) {
                var handler = $rootScope.$on('ng-oidc-client.userInfoChanged', callback);
                scope.$on('$destroy', handler);
            };
            return {
                manager: _this.mgr,
                getUserInfo: getUserInfo,
                getUrls: getUrls,
                signinPopup: signinPopup,
                signinRedirect: signinRedirect,
                signoutPopup: signoutPopup,
                signoutRedirect: signoutRedirect,
                userInfoChanged: userInfoChanged
            };
        };
        return NgOidcClientProvider;
    }());
    app.provider('ngOidcClient', NgOidcClientProvider);
})(NgOidcClient || (NgOidcClient = {}));