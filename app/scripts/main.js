angular.module('ngSynthKeyboard', ['ngSynth', 'ngTouch'])

.directive('synth', function() {
    return {
        restrict: "E",
        link: function(scope, elem, attrs) {

            var tones = [130.813] //261.625565
            for (var i = 0; i < 33; i++) {
                tones.push(tones[i] * 1.0595465)

            }

            scope.tones = tones;

        }
    }
})
.directive("key",function(){
  return {
    restrict:"AE",
    scope:true,
    link:function(scope,elem) {

      elem.on("mouseover",function(){
        scope.mouseover = true;
      });

      elem.on("mouseout",function(){
        scope.mouseover = false;
      });

      scope.touchkey = function(){
        scope.mouseover = true;
        scope.touchdown = true;
        //console.log("touchkey")
      };

    },
    controller:function($scope,$window,$interval) {

      $($window).on("mousedown",function(){
        $scope.touchdown = true;
      })

      $($window).on("mouseup",function(){
        $scope.touchdown = false;
      });

/* This makes all the keys play all at once. This serves as a negative confirmation that sound WILL NOT PLAY on ios without some help.
      $(window).on("touchstart",function(){
        //Apparently safari on ios requires sound be started by a user event?
        $scope.playing = true;
        console.log("touchstart")
      });
*/
/*
      $($window).on("click",function(){
        $scope.touchdown = true;
        console.log("click")
      })
*/

      $scope.$watch(function(){
        return $scope.mouseover && $scope.touchdown;
      },function(val){
        if (val) {
          $scope.playing = true;
        } else {
          $scope.playing = false;
        }
      },true);

      $scope.$watch("tone",function(val){
        $scope.note = val;
      })
    }
  }
})
