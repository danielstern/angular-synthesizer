  angular.module("ngSynthesizer", [])

  .run(function() {
      console.log("synth run...");


  })

  .directive('ngSynthesizer', function() {
  	return {
  		restrict:"AE",
  		link:function(scope,elem,attrs){
  			  scope.context = new webkitAudioContext(); // Create audio container			
  			  scope.frequency = attrs.frequency;
  			  console.log("attrs?",attrs);
  		},
  		controller:function($scope) {
  			$scope.playing = false;

  			$scope.$watch("frequency",function(val){
  				console.log("frequency changed...",val);
  				if ($scope.oscillator) {
  					$scope.oscillator.frequency.value = val;
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
