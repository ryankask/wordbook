/* global define */

define(
  ['angular', 'filters', 'services', 'directives', 'controllers',
   'angularRoute', 'jquery'],
  function(angular) {
    'use strict';

    var dependencies = [
      'ngRoute',
      'wordbook.controllers',
      'wordbook.filters',
      'wordbook.services',
      'wordbook.directives'
    ];

    var app = angular.module('wordbook', dependencies);

    app.config(function($routeProvider) {
      $routeProvider.when('/', {
        templateUrl: 'partials/index.html',
        controller: 'WordbookCtrl',
        loginRequired: true
      }).when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).otherwise({
        redirectTo: '/'
      });
    });

    app.run(function($rootScope, $location, User) {
      $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.loginRequired) {
          User.authCheck().then(function(isAuthenticated) {
            if (!isAuthenticated) {
              $location.path('/login');
            }
          });
        }
      });
    });

    return app;
  });
