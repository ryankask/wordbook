/* global define */

define(['angular'], function(angular) {
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
      login: function(email) {
        email = email;
        isAuthenticated = true;
      },
      logout: function() {
        email = null;
        isAuthenticated = false;
      }
    };
  });

  return services;
});
