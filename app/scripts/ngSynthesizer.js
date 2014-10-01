angular.module("ngSynth", ["ngSynth.oscillator"])

.service('audioContext', function() {
    return new webkitAudioContext(); // Create audio container
});
