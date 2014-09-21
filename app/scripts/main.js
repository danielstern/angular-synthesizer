  angular.module("ngSynthesizer", [])

  .run(function() {

  })
      .service('audioContext', function() {
          return new webkitAudioContext(); // Create audio container	
      })

  .factory('Oscillator',function(audioContext){
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
          controller: function($scope,$timeout) {

          		$scope.playNote = function(note) {
          			if (!note.frequency) note = Note.fromLatin(note);
          			$scope.note = note;
          			$scope.play();
          			$timeout(function(){
          				$scope.stop();
          			},300);
          		}

              $scope.play = function() {
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

              $scope.$watch("frequency", function(val) {

                  if (!$scope.autotune) {
                      $scope.state.frequency = val;
                  } else if ($scope.tones) {
                      var range = $scope.max - $scope.min;
                      var percentage = (val / range) - 1;
                      var tonesIndex = Math.floor(($scope.tones.length - 1) * percentage);
                      var tone = $scope.tones[tonesIndex];
                      $scope.state.frequency = tone.frequency();
                  }
              });


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

              $scope.$watch("wave", function(val) {
                  $scope.state.wave = val;
              });

          }
      }
  })

  .directive('oscillator', function(Oscillator) {
      return {
          restrict: "AE",
          scope: true,
          link: function(scope, elem, attrs) {

              scope.wave = attrs.wave || "SINE";
          },
          controller: function($scope, audioContext) {

              $scope.context = audioContext;
              $scope.playing = false;

              $scope.$watch("wave", function(val) {
                  if ($scope.oscillator) {
                      $scope.oscillator.type = $scope.oscillator[val];
                  }
              })

              $scope.$watch("state", function(state) {

                  if (state.playing) {
                      $scope.startTone();
                  } else {
                      $scope.stop();
                  }

                  if ($scope.oscillator) {
                      $scope.oscillator.frequency.value = state.frequency;
                  }


              }, true);

              $scope.startTone = function() {

                  if ($scope.oscillator) {
                      return;
                  }

                  $scope.oscillator = new Oscillator();
                  $scope.oscillator.frequency.value = $scope.frequency || 320;
                  $scope.oscillator.noteOn(1); // Play instantly

                  $scope.oscillator.type = $scope.oscillator[$scope.wave];

              }

              $scope.stop = function() {

                  if (!$scope.oscillator) {
                      return;
                  }

                  $scope.oscillator.noteOff(1);
                  $scope.playing = false;
                  $scope.oscillator = null;
              }
          }
      }
  })
