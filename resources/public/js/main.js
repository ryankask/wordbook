/* global require */

require.config({
  paths: {
    jquery: '/components/jquery/jquery.min',
    foundation: '/js/vendor/foundation.min',
    angular: '/components/angular/angular.min',
    angularRoute: '/components/angular-route/angular-route.min'
  },
  baseUrl: 'js/lib',
  shim: {
    foundation: ['jquery'],
    angular: { exports: 'angular' },
    angularRoute: ['angular']
  },
  priority: ['angular']
});

window.name = 'NG_DEFER_BOOTSTRAP!';

require(['angular', 'app', 'foundation'], function(angular) {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['wordbook']);
  });
});
