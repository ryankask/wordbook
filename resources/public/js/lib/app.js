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

    return app;
  });
