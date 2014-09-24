angular.module("ngSynthKeyboard", ['ngSynth'])

.directive('synth', function() {
    return {
        restrict: "E",
        link: function(scope, elem, attrs) {

            var tones = [130.813]
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
    },
    controller:function($scope,$window,$interval) {

      $($window).on("mousedown",function(){
        $scope.touchdown = true;
      })

      $($window).on("mouseup",function(){
        $scope.touchdown = false;
      });

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