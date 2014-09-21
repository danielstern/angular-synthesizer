  angular.module("ngSynthesizer", [])

  .run(function() {

  })
      .service('audioContext', function() {
          return new webkitAudioContext(); // Create audio container	
      })

  .factory('Oscillator', function(audioContext) {
      return function() {
          var oscillator = audioContext.createOscillator(); // Create sound source
          oscillator.connect(audioContext.destination); // Connect sound to output
          return oscillator;

      }
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

  .directive('oscillator', function(Oscillator) {
      return {
          restrict: "AE",
          scope: true,
          link:function(scope,elem,attrs) {
          	attrs.$observe("wave", function() {
          	    scope.wave = attrs.wave;
          	});
          },
          controller: function($scope) {

          		$scope.wave = "SINE";

              $scope.$watch("wave", function(val) {
                  if ($scope.oscillator) {
                      $scope.oscillator.type = $scope.oscillator[val];
                  }
              })

              $scope.$watch("state", function(state) {

                  if (state.playing) {
                      $scope.startTone();
                      $scope.oscillator.frequency.value = state.frequency;
                  } else {
                      $scope.stop();
                  }

              }, true);

              $scope.startTone = function() {

                  if ($scope.oscillator) {
                      return;
                  }

                  $scope.oscillator = new Oscillator();

                  $scope.oscillator.frequency.value = $scope.frequency;
                  $scope.oscillator.type = $scope.oscillator[$scope.wave];

                  $scope.oscillator.noteOn(1);
              }

              $scope.stop = function() {

                  if (!$scope.oscillator) {
                      return;
                  }

                  $scope.oscillator.noteOff(1);
                  $scope.oscillator = null;
              }
          }
      }
  })
