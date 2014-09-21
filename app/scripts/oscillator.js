angular.module("ngSynthesizer")
    .factory('Oscillator', function($interval, NativeOscillatorFactory) {
        return function() {
            var _oscillator = NativeOscillatorFactory();

            var factory = this;
            var _oscillatorRunning = false;

            factory.wave = "SINE";

            this.start = function() {
              factory.playing = true;
            }

            this.stop = function() {
              factory.playing = false;
            }

            $interval(function(){
              if (_oscillator.frequency.value !== factory.frequency) {
                _oscillator.frequency.value = factory.frequency;
              }

              if (factory.playing) {
                factory.startTone();
              } else {
                factory.stopTone();
              }

              _oscillator.type = _oscillator[factory.wave];
            },1);

            this.startTone = function() {
              if (_oscillatorRunning) return;
              _oscillator = NativeOscillatorFactory()
              _oscillator.frequency.value = factory.frequency;
              _oscillator.noteOn(1);
              _oscillatorRunning = true;
            };

            this.stopTone = function() {
              if (!_oscillatorRunning) return;
              _oscillator.noteOff(1);
              _oscillatorRunning = false;
            }
        }
    })
    .factory('NativeOscillatorFactory',function(audioContext){
      return function(){
        var _oscillator = audioContext.createOscillator(); // Create sound source
          _oscillator.connect(audioContext.destination); // Connect sound to output
          return _oscillator;
      }
    })
    .directive('oscillator', function(Oscillator) {
        return {
            restrict: "AE",
            scope: true,
            link: function(scope, elem, attrs) {
                attrs.$observe("wave", function() {
                    scope.wave = attrs.wave;
                });

                attrs.$observe("interval", function() {
                    scope.interval = attrs.interval;
                });
            },
            controller: function($scope,Oscillator) {

              var oscillator = new Oscillator();

                $scope.$watch("wave", function(val) {
                       oscillator.wave = val;
                })

                $scope.$watch("interval", function(val) {
                       oscillator.frequency = $scope.frequency * $scope.interval;
                })


                $scope.$watch("state", function(state) {
                    if (state.playing) {
                        oscillator.start();
                    } else {
                        oscillator.stop();
                    }

                    oscillator.frequency = $scope.frequency * ($scope.interval || 1);
                }, true);
            }
        }
    })
