/* jshint node:true */

var gulp = require('gulp');

var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');

var jade = require('gulp-jade');
var htmlMin = require('gulp-htmlmin');

var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');


var paths = {
    jade: ['./src/**/*.jade', '!./src/includes/**/*.jade'],
    less: ['./src/**/*.less'],
    js: ['./src/**/*.js']
};

var watcherJade;
var watcherLess;
var watcherJs;


gulp.task('markup', function() {
    var locals = {
        title: "有道划词字典"
    };

    var stream  = gulp.src(paths.jade)
        .pipe(plumber())
        .pipe(jade({
            locals: locals,
            pretty: true
        }))
        /*
        .pipe(htmlMin({
            removeComments: true,
            collapseWhitespace: true,
            keepClosingSlash: true
        }))
        */
        .pipe(gulp.dest('./dest'))
        .pipe(livereload());

    return stream;
});


gulp.task('styles', function() {
    var stream = gulp.src(paths.less)
        .pipe(plumber())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest('./dest'))
        .pipe(livereload());

    return stream;
});


gulp.task('js', function() {
    var stream = gulp.src(paths.js)
        .pipe(plumber())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(gulp.dest('./dest'))
        .pipe(livereload());

    return stream;
});


var watchCallback = function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', task running...');
};

gulp.task('default', ['markup', 'styles', 'js'], function() {
    livereload.listen();

    watcherJade = gulp.watch(paths.jade, ['markup']);
    watcherJade.on('change', watchCallback);

    watcherLess = gulp.watch(paths.less, ['styles']);
    watcherLess.on('change', watchCallback);

    watcherJs = gulp.watch(paths.js, ['js']);
    watcherJs.on('change', watchCallback);
});
