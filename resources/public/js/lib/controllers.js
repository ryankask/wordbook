/* global define */

define(['angular'], function(angular) {
  'use strict';

  var controllers = angular.module('wordbook.controllers', []);

  controllers.controller('WordbookCtrl', function($scope) {

  });

  controllers.controller('LoginCtrl', function($scope, $location, User) {
    $scope.creds = { invalid: false };

    $scope.login = function() {
      User.login($scope.creds.email, $scope.creds.password).then(
        function() {
          $location.url('/');
        },
        function() {
          $scope.creds.invalid = true;
        });
    };
  });

  return controllers;
});
