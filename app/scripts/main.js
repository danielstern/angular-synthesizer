angular.module("ngSynthKeyboard", ['ngSynth','ngTouch'])

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
.directive("key",function(ngSynth){
  return {
    restrict:"AE",
    scope:true,
    link:function(scope,elem) {

      elem.on("mouseover touchstart",function(){
        scope.mouseover = true;
      });

      elem.on("mouseout touchstart",function(){
        scope.mouseover = false;
      });
    },
    controller:function($scope,$window,$interval) {

      $($window).on("mousedown touchstart",function(){
        ngSynth.toot();
        $scope.touchdown = true;
      })

      $($window).on("mouseup touchend",function(){
        $scope.touchdown = false;
      });

       $($window).on("selectstart",function(){
          return false;
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