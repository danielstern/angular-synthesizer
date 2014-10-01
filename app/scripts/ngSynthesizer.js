angular.module("ngSynth", ["ngSynth.oscillator"])

.service('audioContext', function() {
    return window.__audioContext || new webkitAudioContext(); // Create audio container  
})

.service("ngSynth",function(_NativeOscillatorFactory){
	this.toot = function() {
		var oscillator = _NativeOscillatorFactory();
		oscillator.noteOn(0);
		oscillator.noteOff(0);
		console.log("toot");
	}
})