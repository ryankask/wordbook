/* global define */

define(['angular'], function(angular) {
  'use strict';

  var directives = angular.module('wordbook.directives', []);

  directives.directive('wbLoginButton', function(User, $location) {
    // TODO: Move this to a navigation controller?

    return {
      restrict: 'A',
      template: '<a href="#/login" ng-hide="isAuthenticated()">Log in</a>' +
                '<a href="#" ng-click="logout()" ng-show="isAuthenticated()">Log out</a>',
      link: function(scope) {
        scope.isAuthenticated = User.isAuthenticated;
        scope.logout = function() {
          User.logout().then(function() {
            $location.url('/login');
          });
        };
      }
    };
  });

  return directives;
});
