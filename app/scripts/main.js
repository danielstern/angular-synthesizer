  angular.module("ngSynthesizer", [])

  .run(function() {

  })
      .service('audioContext', function() {
          return new webkitAudioContext(); // Create audio container	
      })



  .directive('ngSynthesizer', function() {
      return {
          restrict: "AE",
          link: function(scope, elem, attrs) {
              attrs.$observe("note", function() {
                  scope.note = Note.fromLatin(attrs.note || "E4");
              });

              attrs.$observe("scale", function(val) {
                  scope.scale = attrs.scale;
              });

              scope.music = MUSIC;
              scope.autotune = true;

              scope.state = {
                  wave: 'SQUARE',
                  playing: false
              };
          },
          controller: function($scope, $timeout) {

              $scope.play = function(note) {
                  if (note) {
                      $scope.setNote(note);
                  }
                  $scope.playing = true;
                  $scope.state.playing = true;
              }

              $scope.stop = function() {
                  $scope.playing = false;
                  $scope.state.playing = false;
              }

              $scope.setNote = function(val) {
                  $scope.note = val;
              }

              $scope.setScale = function(val) {
              	$scope.scale = val;
              }

              $scope.$watch("scale", function(val) {
                  if (val) {
                      $scope.tones = $scope.note.scale(val || 'major');
                      $scope.min = $scope.tones[0].frequency();
                      $scope.max = $scope.tones[$scope.tones.length - 1].frequency();
                  }
              });

              $scope.$watch("note", function(val) {
                  if (val) {
                      $scope.state.frequency = val.frequency();
                      $scope.frequency = val.frequency();
                  }
              });
          }
      }
  })
