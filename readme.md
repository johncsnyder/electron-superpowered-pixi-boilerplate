# Electron Superpowered Pixi Boilerplate


Tested on OS X
- Electron v1.6.11
- Superpowered SDK v1.0.5



In `.bashrc`, `.bash_profile`, set ENV variable 
SUPERPOWERED_ROOT to Superpowered SDK library:

```
export SUPERPOWERED_ROOT=/path/to/superpowered
```

This path should contain include header files and precompiled libraries for Linux, OS X, etc.

i.e.

```
git clone https://github.com/superpoweredSDK/Low-Latency-Android-Audio-iOS-Audio-Engine
```


This boilerplate code demonstrates a few simple things using pixi & superpowered audio:

- Creates a WebGL canvas and display some basic text and a few sprites for play/stop audio
- Creates a node native addon that links with Superpowered SDK, decodes an mp3 and applies
	a simple filter and returns the PCM data to the Electron app
- Use web audio api to create an AudioSourceBufferNode and play / stop the audio using
	pixi sprite buttons

