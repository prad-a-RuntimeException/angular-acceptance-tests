'use strict';

var browserify = require('browserify');
var del = require('del');
var source = require('vinyl-source-stream');
var vinylPaths = require('vinyl-paths');
var glob = require('glob');
var Server = require('karma').Server;
var gulp = require('gulp');
var p = require('partialify');

// Load all gulp plugins listed in package.json
var gulpPlugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

// Define file path variables
var paths = {
  root: 'app/', // App root path
  src: 'app/js/', // Source path
  view: 'app/views/', // View path
  dist: 'app/dist/', // Distribution path
  test: 'test/' // Test path
};

/*
 * Useful tasks:
 * - gulp fast:
 *   - linting
 *   - unit tests
 *   - browserification
 *   - no minification, does not start server.
 * - gulp watch:
 *   - starts server with live reload enabled
 *   - lints, unit tests, acceptance tests, browserifies and live-reloads changes in browser
 *   - no minification
 * - gulp:
 *   - linting
 *   - unit tests
 *   - acceptance tests
 *   - browserification
 *   - minification and browserification of minified sources
 *
 * At development time, you should usually just have 'gulp watch' running in the
 * background all the time. Use 'gulp' before releases.
 */

var liveReload = true;

gulp.task('clean', function() {
  return gulp
    .src([paths.root + 'ngAnnotate', paths.dist], {
      read: false
    })
    .pipe(vinylPaths(del));
});

gulp.task('lint', function() {
  return gulp
    .src(['gulpfile.js',
      paths.src + '**/*.js',
      paths.test + '**/*.js',
      '!' + paths.src + 'third-party/**',
      '!' + paths.test + 'browserified/**',
    ])
    .pipe(gulpPlugins.eslint())
    .pipe(gulpPlugins.eslint.format());
});

gulp.task('unit', function() {
  return gulp.src([
    paths.test + 'unit/**/*.js'
  ])
    .pipe(gulpPlugins.mocha({
      reporter: 'dot'
    }));
});

gulp.task('browserify', /*['lint', 'unit'],*/ function() {
  return browserify(paths.src + 'app.js', {
    debug: true
  })
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(gulpPlugins.connect.reload());
});

gulp.task('ngAnnotate', ['lint', 'unit'], function() {
  return gulp.src([
    paths.src + '**/*.js',
    '!' + paths.src + 'third-party/**',
  ])
    .pipe(gulpPlugins.ngAnnotate())
    .pipe(gulp.dest(paths.root + 'ngAnnotate'));
});

gulp.task('browserify-min', ['ngAnnotate'], function() {
  return browserify(paths.root + 'ngAnnotate/app.js')
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(gulpPlugins.streamify(gulpPlugins.uglify({
      mangle: false
    })))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('browserify-tests', function() {
  var bundler = browserify({
    debug: true
  });

  bundler.transform(p);

  glob
    .sync(paths.test + 'acceptance-tests/**/*.js')
    .forEach(function(file) {
      bundler.add(file);
    });
  glob
    .sync(paths.test + 'unit/**/*.js')
    .forEach(function(file) {
      bundler.add(file);
    });
  return bundler
    .bundle()
    .pipe(source('browserified_tests.js'))
    .pipe(gulp.dest(paths.test + 'browserified'));
});

gulp.task('karma', ['browserify-tests'], function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});


gulp.task('karmalive', ['browserify-tests'], function(done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done).start();
});

gulp.task('server', ['browserify'], function() {
  gulpPlugins.connect.server({
    root: 'app',
    livereload: liveReload,
  });
});

gulp.task('watch', function() {
  gulp.start('server');
  gulp.watch([
    paths.src + '**/*.js',
    '!' + paths.src + 'third-party/**',
    paths.test + '**/*.js',
  ], ['fast']);
});

gulp.task('fast', ['clean'], function() {
  gulp.start('browserify');
});

gulp.task('default', ['clean'], function() {
  liveReload = false;
  gulp.start('karma', 'browserify', 'browserify-min');
});
