var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var utilities = require('gulp-util');
var concat = require('gulp-concat')
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var del = require('del');
var jshint = require('gulp-jshint');
var lib = require('bower-files')({
  //This configuration is necessary for adding bootstrap to bower-files.
  "overrides":{
    "bootstrap": {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});

//This line is necessary to establish the production environment.
var buildProduction = utilities.env.production;

//Starts the server at localhost:3000, running index.html.
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  //Watchers take two arguments. Whenever a file in the first argument changes, the gulp task in the second argument is run. So if any js files are changed, the jsBuild task will run.
  gulp.watch(['js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild'])
});

//The following two tasks will reload the server and are set to run when changes are made to certain files. This allows the server to stay updated.
gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

//When gulp bower is run, it will run bowerJS and bowerCSS.
gulp.task('bower', ['bowerJS', 'bowerCSS']);

//The next two tasks use bower-files to concatenate js files into one file and css files into another. This way index.html needs fewer dependencies.
gulp.task('bowerJS', function () {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('bowerCSS', function() {
  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./build/css'));
});

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

//This task uses "del" to clean out the build and temp folders after gulp build is run. This makes sure the folders are cleaned out before the new build.
gulp.task("clean", function() {
  return del(['build', 'tmp']);
});

//The conditional statement allows for different tasks to be run depending on whether they are related to development or production. Running "gulp build" will build the dev environment while running "gulp build --production" will build the production environment.
gulp.task("build", ["clean"], function() {
  if (buildProduction) {
    gulp.start('minifyScripts');
  } else {
    gulp.start('jsBrowserify');
  }
  gulp.start('bower');
});

//This linter can be run to detect syntax and other errors in the code.
gulp.task('jshint', function() {
  return gulp.src(['js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
});
