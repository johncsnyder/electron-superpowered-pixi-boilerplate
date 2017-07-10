var fs = require('fs')
var path = require('path')

// Load addon
try {
		// Packaged .app electron puts filter.node into .app/Contents/Resources/
		// while audio.js is in .app/Contents/Resources/app/
    var filter = require(path.join(__dirname, '../filter'))
}
catch(err) {
	// Dev mode
	var filter = require(path.join(__dirname, 'build/Release/filter'))
}


// Create an audio context
var audioCtx = new window.AudioContext


// Helper function
function int16tofloat32 (x) {
  return (x >= 0x8000) ? -(0x10000 - x) / 0x8000 : x / 0x7FFF
}


// Load test audio file and filter
var data = filter.filter(path.join(__dirname, 'resources/test.mp3'))
var numSamples = data.length / 2
var channels = 2


// Create a stereo audio buffer
var audioBuffer = audioCtx.createBuffer(channels, numSamples, audioCtx.sampleRate)
var leftChannel = audioBuffer.getChannelData(0)
var rightChannel = audioBuffer.getChannelData(1)


// Copy interleaved data into audio buffer
for (var i = 0; i < numSamples; i++) {
   leftChannel[i] = int16tofloat32(data[2*i])
   rightChannel[i] = int16tofloat32(data[2*i + 1])
}


// // Get an AudioBufferSourceNode.
// // This is the AudioNode to use when we want to play an AudioBuffer
// var source = audioCtx.createBufferSource()
// // set the buffer in the AudioBufferSourceNode
// source.buffer = audioBuffer
// // connect the AudioBufferSourceNode to the
// // destination so we can hear the sound
// source.connect(audioCtx.destination)
// // start the source playing
// source.start()
