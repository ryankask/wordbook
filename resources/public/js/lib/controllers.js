/* global define */

define(['angular'], function(angular) {
  'use strict';

  var controllers = angular.module('wordbook.controllers', []);

  controllers.controller('WordbookCtrl', function($scope) {
    console.log('WordbookCtrl loaded');
  });

  return controllers;
});
