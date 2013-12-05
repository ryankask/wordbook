/* global angular */

(function() {
  'use strict';

  var services = angular.module('wordbook.services', []);

  services.factory('User', function($q, $http) {
    var email,
        isAuthenticated;

    return {
      authCheck: function() {
        var deferred = $q.defer();

        if (typeof isAuthenticated === 'undefined') {
          $http.get('/auth/check').then(function(result) {
            isAuthenticated = result.data.isAuthenticated;
            deferred.resolve(isAuthenticated);
          });
        } else {
          deferred.resolve(isAuthenticated);
        }

        return deferred.promise;
      },
      login: function(email, password) {
        var deferred = $q.defer(),
            data = { email: email, password: password };

        $http.post('/auth/login', data).then(function(result) {
          if (result.data.isAuthenticated) {
            email = email;
            isAuthenticated = true;
            deferred.resolve();
          } else {
            isAuthenticated = false;
            deferred.reject();
          }
        });

        return deferred.promise;
      },
      logout: function() {
        var deferred = $q.defer();

        $http.post('/auth/logout').then(function(result) {
          if (!result.data.isAuthenticated) {
            email = null;
            isAuthenticated = false;
            deferred.resolve();
          } else {
            deferred.reject();
          }
        });

        return deferred.promise;
      },
      isAuthenticated: function() {
        return isAuthenticated;
      }
    };
  });

  services.factory('Words', function($http) {
    return {
      put: function(wordData) {
        var id = wordData._id;

        if (id && wordData._rev) {
          delete wordData._id;
          return $http.put('/api/words/' + id, wordData);
        }

        return $http.post('/api/words', wordData);
      },
      latest: function() {
        return $http.get('/api/words/latest');
      },
      search: function(query) {
        return $http.get('/api/words/search?q=' + query);
      }
    };
  });
})();
