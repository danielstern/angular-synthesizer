  angular.module("ngSynthesizer", [])

  .run(function() {
      // console.log("synth run...");
  })

  .directive('ngSynthesizer', function() {
      return {
          restrict: "AE",
          controller: function($scope) {

              $scope.play = function() {
                  $scope.playing = true;
                  $scope.state.playing = true;
              }

              $scope.stop = function() {
                  $scope.playing = false;
                  $scope.state.playing = false;
              }

              $scope.$watch("frequency", function(val) {
                  $scope.state.frequency = val;
              })

              $scope.$watch("wave", function(val) {
                  $scope.state.wave = val;
              })

              $scope.state = {
                  wave: 'SQUARE',
                  playing: false
              }
          }
      }
  })
      .directive('oscillator', function() {
          return {
              restrict: "AE",
              scope: true,
              link: function(scope, elem, attrs) {
                  scope.context = new webkitAudioContext(); // Create audio container			
                  scope.wave = attrs.wave || "SINE";
                  // scope.oscillator = scope.context.createOscillator(); // Create sound source
                  // scope.frequency = attrs.frequency;
              },
              controller: function($scope) {
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

                      $scope.oscillator = $scope.context.createOscillator(); // Create sound source
                      $scope.oscillator.connect($scope.context.destination); // Connect sound to output
                      $scope.oscillator.frequency.value = $scope.frequency || 320;
                      $scope.oscillator.noteOn(1); // Play instantly

                      console.log("seting wave type...",$scope.wave);
                      $scope.oscillator.type = $scope.oscillator[$scope.wave];

                      // window.oscillator = $scope.oscillator;
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
