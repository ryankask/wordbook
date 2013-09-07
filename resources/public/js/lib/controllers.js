/* global define */

define(['angular'], function(angular) {
  'use strict';

  var controllers = angular.module('wordbook.controllers', []);

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

  controllers.controller('WordsCtrl', function($scope, User, Words) {
    var i;

    $scope.partsOfSpeech = ['Noun', 'Adjective', 'Verb', 'Adverb'];
    $scope.wordForm = { action: 'Add' };
    $scope.recentWords = [];

    User.authCheck().then(function(isAuthenticated) {
      if (isAuthenticated) {
        Words.latest().success(function(latestWords) {
          $scope.latestWords = latestWords;
        });
      }
    });

    $scope.createOrUpdateWord = function() {
      var fields = ['_id', '_rev', 'word', 'pos', 'definition', 'notes'],
          formData = {};

      if ($scope.wordForm.word.pos === 'Noun') {
        if (!$scope.wordForm.word.gender) {
          $scope.wordForm.message = 'Nouns must have a gender.';
          $scope.wordForm.alert = 'alert';
          return;
        }
        fields.push('gender');
      } else if ($scope.wordForm.word.pos === 'Verb' ) {
        fields.push('perfective');
      }

      for (i = 0; i < fields.length; i++) {
        formData[fields[i]] = $scope.wordForm.word[fields[i]];
      }

      formData.pos = formData.pos.toLowerCase();

      Words.put(formData).success(function(data) {
        if (data._id) {
          $scope.wordForm.alert = 'success';
          $scope.wordForm.message = '"' + data.word  + '" successfully added/updated';
          $scope.wordForm.word = {};

          for (i = 0; i < $scope.recentWords.length; i++) {
            if ($scope.recentWords[i]._id === data._id) {
              $scope.recentWords.splice(i, 1);
              break;
            }
          }
          $scope.recentWords.unshift(data);

          // Check if the word is one of the latest ones and update it
          for (i = 0; i < $scope.latestWords.length; i++) {
            if ($scope.latestWords[i]._id === data._id) {
              $scope.latestWords[i] = data;
              break;
            }
          }
        }
      }).error(function() {
        $scope.wordForm.alert = 'alert';
        $scope.wordForm.message = 'Error adding/updating word "' + formData.word  + '".';
      });
    };

    $scope.loadWord = function(word) {
      var wordCopy = angular.copy(word);
      wordCopy.pos = wordCopy.pos.charAt(0).toUpperCase() + wordCopy.pos.slice(1);
      $scope.wordForm.word = wordCopy;

      // Reset display-related form properties
      $scope.wordForm.action = 'Update';
      delete $scope.wordForm.message;
    };

    $scope.showCreateForm = function() {
      $scope.wordForm.action = 'Add';
      delete $scope.wordForm.word;
      delete $scope.wordForm.message;
    };
  });

  return controllers;
});
