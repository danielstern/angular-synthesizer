  angular.module("ngSynthesizer", [])

  .run(function() {
      console.log("synth run...");


  })

  .directive('ngSynthesizer', function() {
      return {
          restrict: "AE",
          controller: function ($scope) {
              $scope.playing = true;
          }

      }
  })
      .directive('oscillator', function() {
          return {
              restrict: "AE",
              require: "^ngSynthesizer",
              link: function(scope, elem, attrs) {
                  scope.context = new webkitAudioContext(); // Create audio container			
                  scope.frequency = attrs.frequency;
              },
              controller: function($scope) {
                  $scope.playing = false;

                  $scope.$watch("frequency", function(val) {
                      if ($scope.oscillator) {
                          $scope.oscillator.frequency.value = val;
                      }
                  })

                  $scope.wave = "SINE";

                  $scope.$watch("wave", function(val) {
                      if ($scope.oscillator) {
                          $scope.oscillator.type = $scope.oscillator[val];
                      }
                  })

                  $scope.play = function() {
                      $scope.playing = true;
                      $scope.oscillator = $scope.context.createOscillator(); // Create sound source
                      $scope.oscillator.connect($scope.context.destination); // Connect sound to output
                      $scope.oscillator.frequency.value = $scope.frequency || 320;
                      $scope.oscillator.noteOn(1); // Play instantly

                      window.oscillator = $scope.oscillator;
                  }

                  $scope.stop = function() {
                      $scope.oscillator.noteOff(1);
                      $scope.playing = false;
                  }
              }
          }
      })
