angular.module("ngSynthKeyboard", ['ngSynth'])

.directive('synth', function() {
    return {
        restrict: "E",
        link: function(scope, elem, attrs) {

            // attrs.$observe("note", function() {
            //     scope.note = Note.fromLatin(attrs.note || "E4");
            // });

            // attrs.$observe("scale", function(val) {
            //     scope.scale = attrs.scale;
            // });

            // scope.music = MUSIC;
            // scope.autotune = true;

            // scope.state = {
            //     playing: false
            // };

            // scope.oscillators = [{
            //     wave: "SQUARE",
            //     interval: 1
            // }]
        },
        controller: ["$scope", "$timeout",
            function($scope, $timeout) {


                // $scope.setScale = function(val) {
                //  $scope.scale = val;
                // }

                // $scope.$watch("scale", function(val) {
                //     if (val) {
                //         $scope.tones = $scope.note.scale(val || 'major');
                //         $scope.min = $scope.tones[0].frequency();
                //         $scope.max = $scope.tones[$scope.tones.length - 1].frequency();
                //     }
                // });

                // var tones = [32.703] // contra c
                var tones = [130.813]
                for (var i = 0; i < 33; i++) {
                    tones.push(tones[i] * 1.0595465)

                }

                // $scope.tones = [440,550,660,770];
                $scope.tones = tones;

                $scope.$watch("note", function(val) {
                    if (val) {
                        $scope.state.frequency = val;
                        $scope.frequency = val;
                    }
                });
            }
        ]
    }
})
.directive("key",function(){
  return {
    restrict:"AE",
    scope:true,
    link:function(scope,elem) {
      console.log("Key hello",scope.tone);
      elem.on("mouseover",function(){
        scope.mouseover = true;
      });

      elem.on("mouseout",function(){
        scope.mouseover = false;
      });

      scope.activated = false;
    },
    controller:function($scope,$window,$interval) {

      $scope.state = {};

      $($window).on("mousedown",function(){
        console.log("global mousedown");
        $scope.touchdown = true;
      })

      $($window).on("mouseup",function(){
        console.log("global mouseup");
        $scope.touchdown = false;
      });

      $scope.$watch(function(){
        return $scope.mouseover && $scope.touchdown;
      },function(val){
        console.log("playing and touchdown",val);
        if (val) {
          console.log("playing note...");
          $scope.play();
        } else {
          $scope.stop();
        }
      },true);

      $scope.$watch("tone",function(tone){
        console.log("tone change...",tone);
        $scope.setNote(tone);
      })

      $scope.play = function(note) {
          
          $scope.playing = true;
          $scope.state.playing = true;
      }

      $scope.stop = function() {
          $scope.playing = false;
          $scope.state.playing = false;
      }

      $scope.setNote = function(val) {
        console.log("note set...",val);
          $scope.note = val;
      }

    }
  }
})