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

  controllers.controller('WordsCtrl', function($scope, Words) {
    var recentWordIds = [],
        i;

    $scope.partsOfSpeech = ['Noun', 'Adjective', 'Verb', 'Adverb'];
    $scope.wordForm = { action: 'Add' };
    Words.latest().success(function(latestWords) {
      $scope.latestWords = latestWords;
    });
    $scope.recentWords = [];

    $scope.createOrUpdateWord = function() {
      var fields = ['word', 'pos', 'definition', 'notes'],
          formData = {},
          wordAction;

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

      if ($scope.wordForm.action === 'Add') {
        wordAction = Words.create;
      } else {
        wordAction = Words.update;
        formData._id = $scope.wordForm._id;
        formData._rev = $scope.wordForm._rev;
      }

      wordAction(formData).success(function(data) {
        if (data._id) {
          $scope.wordForm.alert = 'success';
          $scope.wordForm.message = '"' + data.word  + '" successfully added/updated';
          $scope.wordForm.word = {};

          if (recentWordIds.indexOf(data._id) < 0) {
            $scope.recentWords.push(data);
            recentWordIds.push(data._id);
          } else {
            for (i = 0; i < $scope.recentWords.length; i++) {
              if ($scope.recentWords[i]._id === data._id) {
                $scope.recentWords.splice(i, 1);
                break;
              }
            }
            $scope.recentWords.unshift(data);
          }
        }
      }).error(function() {
        $scope.wordForm.alert = 'alert';
        $scope.wordForm.message = 'Error adding/updating word "' + formData.word  + '".';
      });
    };

    $scope.loadWord = function(word) {
      $scope.wordForm.action = 'Update';
      word.pos = word.pos.charAt(0).toUpperCase() + word.pos.slice(1);
      $scope.wordForm.word = word;
      $scope.wordForm._id = word._id;
      $scope.wordForm._rev = word._rev;
      delete $scope.wordForm.message;
    };

    $scope.showCreateForm = function() {
      $scope.wordForm.action = 'Add';
      $scope.wordForm.word = {};
      delete $scope.wordForm._id;
      delete $scope.wordForm._rev;
      delete $scope.wordForm.message;
    };
  });

  return controllers;
});
