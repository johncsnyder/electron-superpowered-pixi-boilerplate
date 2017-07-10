'use strict';

var gulp = require('gulp');
var electron = require('electron-connect').server.create();

// https://www.npmjs.com/package/electron-connect
gulp.task('serve', function () {
  // Start browser process
  electron.start();

  // Restart browser process
  gulp.watch('main.js', electron.restart);

  // Reload renderer process
  gulp.watch(['index.html', 'src/canvas.js', 
    'src/audio.js', 'styles/main.css'], electron.reload);
});

gulp.task('reload:browser', function () {
  // Restart main process
  electron.restart();
});

gulp.task('reload:renderer', function () {
  // Reload renderer process
  electron.reload();
});

gulp.task('default', ['serve']);