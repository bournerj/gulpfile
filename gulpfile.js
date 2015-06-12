// Module install command...
// sudo npm install gulp sass gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-uglify gulp-rename gulp-conc main-bower-files gulp-inject event-stream del gulp-filter gulp-notify gulp-jscs gulp-jshint run-sequence gulp-plumber gulp-combine-media-queries --save-dev

"use strict";
 
var gulp            = require('gulp'),
    sass            = require('gulp-ruby-sass'),
    autoprefixer    = require('gulp-autoprefixer'),
    minifycss       = require('gulp-minify-css'),
    uglify          = require('gulp-uglify'),
    rename          = require('gulp-rename'),
    concat          = require('gulp-concat'),
    bowerFiles      = require('main-bower-files'),
    inject          = require('gulp-inject'),
    es              = require('event-stream'),
    clean           = require('del'),
    gulpFilter      = require('gulp-filter'),
    notify          = require('gulp-notify'),
    jscs            = require('gulp-jscs'),
    jshint          = require('gulp-jshint'),
    sequence        = require('run-sequence'),
    plumber         = require('gulp-plumber'),
    cmq             = require('gulp-combine-media-queries'),
    imagemin        = require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant');
 
// Package information, including version
var pkg = require('./package.json');
 
var info = {};
info.src = {
    html : '*.php',
    js   : 'workbench/js',
    css  : 'workbench/scss',
    img  : 'workbench/img',
    bower: 'bower_components'
};
info.dest = {
    html : 'website',
    js   : 'website/js',
    css  : 'website/css',
    img  : 'website/img',
    fonts: 'website/fonts/FontAwesome'
};
 
// Clean build CSS & JS folders
gulp.task('clean', function () {
    clean(info.dest.css);
    return clean(info.dest.js);
});

// Build CSS files
gulp.task('styles', function() {
  return gulp.src(info.src.css + '/*.scss')
    .pipe(plumber())
    .pipe(sass({ style: 'expanded', "sourcemap=none": true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat(pkg.prefix + "-" + pkg.version + '.min.css'))
    .pipe(cmq())
    .pipe(minifycss())
    .pipe(gulp.dest(info.dest.css));
});
// Build DEV CSS files
gulp.task('dev-styles', function() {
  return gulp.src(info.src.css + '/*.scss')
    .pipe(plumber())
    .pipe(sass({ style: 'expanded', "sourcemap=none": true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest(info.dest.css));
});

// Build IE CSS files
gulp.task('styles-IE', function() {
  return gulp.src(info.src.css + '/IE/ie.scss')
    .pipe(plumber())
    .pipe(sass({ style: 'expanded', "sourcemap=none": true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(concat("ie-" + pkg.version + '.min.css'))
    .pipe(cmq())
    .pipe(minifycss())
    .pipe(gulp.dest(info.dest.css + '/IE/'));
});
// Build IE DEV CSS files
gulp.task('dev-styles-IE', function() {
  return gulp.src(info.src.css + '/IE/ie.scss')
    .pipe(plumber())
    .pipe(sass({ style: 'expanded', "sourcemap=none": true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
    .pipe(gulp.dest(info.dest.css + '/IE/'));
});

// Build JS files
gulp.task('js', function () {
    return gulp.src(info.src.js + '/**/*.js')
        .pipe(concat(pkg.prefix + "-" + pkg.version + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(info.dest.js));
});
// Build DEV JS files
gulp.task('dev-js', function () {
    return gulp.src(info.src.js + '/**/*.js')
        .pipe(gulp.dest(info.dest.js));
});

gulp.task('jscs', function() {
    gulp.src(info.src.js + '/**/*.js')
        .pipe(jscs())
        .pipe(notify({
            title: 'JSCS',
            message: 'JSCS Passed. Let it fly!'
        }))

        /* Alternatively for Windows users
        .pipe(notify({
            title: 'JSCS',
            message: 'JSCS Passed. Let it fly!',
            notifier: growlNotifier
        }))
        */
});
gulp.task('lint', function() {
    gulp.src(info.src.js + '/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'))
        .pipe(notify({
            title: 'JSHint',
            message: 'JSHint Passed. Let it fly!',
        }))
});

// Build Bower files:
// concat *.js to vendor.js
// and *.css to vendor.css
gulp.task('bower', function() {
  var jsFilter = gulpFilter('**/*.js')
  var cssFilter = gulpFilter('**/*.css')
  return gulp.src(bowerFiles())
    .pipe(jsFilter)
    .pipe(concat('__vendor-' + pkg.version + '.js'))
    .pipe(uglify())
    .pipe(gulp.dest(info.dest.js))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(concat('__vendor-' + pkg.version + '.css'))
    .pipe(minifycss())
    .pipe(gulp.dest(info.dest.css))
});
// Build DEV Bower files:
gulp.task('dev-bower', function() {
  var jsFilter = gulpFilter('**/*.js')
  var cssFilter = gulpFilter('**/*.css')
  return gulp.src(bowerFiles())
    .pipe(jsFilter)
    .pipe(concat('__vendor-' + pkg.version + '.js'))
    .pipe(gulp.dest(info.dest.js))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(concat('__vendor-' + pkg.version + '.css'))
    .pipe(gulp.dest(info.dest.css))
});

// Shift Font Awesome into the correct dir.
gulp.task('icons', function() { 
    return gulp.src(info.src.bower + '/font-awesome/fonts/**.*') 
        .pipe(gulp.dest(info.dest.fonts)); 
});

// Move the img files across
gulp.task('img', function() { 
    return gulp.src(info.src.img + '/**') 
        .pipe(gulp.dest(info.dest.img)); 
});

// Minify the image files and move them across
gulp.task('imgmin', function() { 
    return gulp.src(info.src.img + '/**') 
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(info.dest.img)); 
});

// Build HTML files
gulp.task('html', function() {
    return gulp.src(info.src.html)
      .pipe(inject(es.merge(
        gulp.src(info.dest.css + '/*.css', {read: false}),
        gulp.src(info.dest.js + '/*.js', {read: false})
      ), {addRootSlash: true, ignorePath: 'website'}))
      .pipe(inject(gulp.src(info.dest.css + '/IE/*.css', {read: false}), {addRootSlash: true, ignorePath: 'website', name: 'IE'}))
      .pipe(gulp.dest(info.dest.html));
});
 
// Full build - clean build folder, build js, build html
gulp.task('build', function(callback) {
  sequence(
        'clean',
        'styles',
        'styles-IE',
        'bower',
        'js',
        'icons',
        'imgmin',
        'html',
        callback
    );
});
// Minor build
gulp.task('rebuild', function(callback) {
  sequence(
        'clean',
        'styles',
        'styles-IE',
        'bower',
        'js',
        'icons',
        'html',
        callback
    );
});
// Dev build - clean build folder, build js, build html - using separate CSS / JS files for easy debugging.
gulp.task('dev-build', function(callback) {
  sequence(
        'clean',
        'dev-styles',
        'dev-styles-IE',
        'dev-bower',
        'dev-js',
        'icons',
        'img',
        'html',
        callback
    );
});

gulp.task('watch', function() {
  gulp.watch(info.src.css + '/*.scss', ['dev-styles']);
  gulp.watch(info.src.css + '/IE/*.scss', ['dev-styles-IE']);
  gulp.watch(info.src.js + '/**/*.js', ['dev-js']);
  gulp.watch(info.src.img + '/*/*.*', ['img']);
});

gulp.task('default', ['watch'], function() {

});
