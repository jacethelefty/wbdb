module.exports = function(app) {
  app.factory('auth', ['$rootScope', '$window', ($rootScope, $window) => {
    class Auth {
      constructor() {
        this.token = $window.localStorage.jwtToken || null;
        this.username = this.token ? this.parseJWT(this.token).username : null;
        $rootScope.loggedIn = !!this.token;
      }

      parseJWT(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse($window.atob(base64));
      }

      saveToken(token) {
        this.token = token;
        $window.localStorage.jwtToken = token;
        this.username = this.parseJWT(this.token).username;
      }

      getToken() {
        return this.token || $window.localStorage.jwtToken;
      }

      logout(cb) {
        this.token = null;
        $window.localStorage.removeItem('jwtToken');
        cb();
      }

      getUserId() {
        if (this.token) return this.parseJWT(this.token).id;
        return null;
      }
    }

    return new Auth();
  }]);
};
