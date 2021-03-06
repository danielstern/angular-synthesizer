angular.module("ngSynth.oscillator",[])

/**Oscillator Factory - Getter and Setters
  frequency - the frequencyo f the oscillator (RW)
  playing - if the oscillator is playing or not
  start() - shortcut to set playing to true
  stop() - shortcut to set playing to false
**/

.factory('Oscillator', ["$interval", "_NativeOscillatorFactory",
    function($interval, NativeOscillatorFactory) {
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

            $interval(function() {
                if (_oscillator.frequency.value !== factory.frequency) {
                    _oscillator.frequency.value = factory.frequency;
                }

                if (factory.playing) {
                    factory._startTone();
                } else {
                    factory._stopTone();
                }

                _oscillator.type = _oscillator[factory.wave];
            }, 1);

            this._startTone = function() {
                if (_oscillatorRunning) return;
                _oscillator = NativeOscillatorFactory()
                _oscillator.frequency.value = factory.frequency;
                _oscillator.noteOn(1);
                _oscillatorRunning = true;
            };

            this._stopTone = function() {
                if (!_oscillatorRunning) return;
                _oscillator.noteOff(1);
                _oscillatorRunning = false;
            }
        }
    }
])

.factory('_NativeOscillatorFactory', ["audioContext",
    function(audioContext) {
        return function() {
            var _oscillator = audioContext.createOscillator(); // Create sound source
            _oscillator.connect(audioContext.destination); // Connect sound to output
            return _oscillator;
        }
    }
])

.directive('oscillator', ["Oscillator",
    function(Oscillator) {
        return {
            restrict: "AE",
            scope: {
              tone:'=',
              playing:'='
            },
            // templateUrl: 'tmpl/oscillatorControl.html',
            link: function(scope, elem, attrs) {
                attrs.$observe("wave", function() {
                    scope.wave = attrs.wave;
                });

                attrs.$observe("interval", function() {
                    scope.interval = attrs.interval;
                });
            },
            controller: ["$scope", "Oscillator",
                function($scope, Oscillator) {

                    var oscillator = new Oscillator();

                    $scope.$watch("wave", function(val) {
                        oscillator.wave = val;
                    })

                    $scope.$watch("interval", function(val) {
                        oscillator.frequency = $scope.frequency * $scope.interval;
                    })

                    $scope.$watch("playing",function(val){
                      if (val) {
                        oscillator.start();
                      } else {
                        oscillator.stop();
                      }
                    })

                    $scope.$watch("tone",function(val){

                      setTimeout(function(){
                        oscillator.frequency = val;
                      },50);
                        
                    })
                }
            ]
        }
    }
])
