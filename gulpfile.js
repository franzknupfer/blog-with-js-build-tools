var gulp = require('gulp');
var utilities = require('gulp-util');
var concat = require('gulp-concat')
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var del = require('del');
var jshint = require('gulp-jshint');

var buildProduction = utilities.env.production;

gulp.task('concatInterface', function() {
  //Pass an array of files to be concatenated for the browser. * is globbing pattern so that all files ending in -interface.js are passed into the array.
  return gulp.src(['./js/*-interface.js'])
  .pipe(concat('allConcat.js'))
  //The created file is going to a temporary destination because it won't be part of the final application.
  .pipe(gulp.dest('./tmp'))
});

//['concatInterface'] is passed as an argument into the task below to let the task know that it shouldn't run before ['concatInterface'].
gulp.task('jsBrowserify', ['concatInterface'], function() {
  //The following entries will be browserified so that the browser can read them.
  return browserify({ entries: ['./tmp/allConcat.js']})
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./build/js'))
});
//Reduces js file to one line of shortened code to improve browser performance.
gulp.task('minifyScripts', ['jsBrowserify'], function(){
  return gulp.src('./build/js/app.js')
  .pipe(uglify())
  .pipe(gulp.dest("./build/js"));
});

gulp.task("clean", function() {
  return del(['build', 'tmp']);
});

gulp.task("build", ["clean"], function() {
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
});

gulp.task('jshint', function() {
  return gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});
