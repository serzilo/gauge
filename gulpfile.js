'use strict';

var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint');

var path = {
    build: {
        js: 'js/build/'
    },
    src: {
        js: 'js/*.js'
    }
};

gulp.task('js:build', function () {
	gulp.src([path.src.js])
		.pipe(jshint())
		.pipe(uglify())
		.pipe(gulp.dest(path.build.js));
});

gulp.task('build', [
    'js:build'
]);

/*
    alias gulp='node_modules/.bin/gulp'
*/
gulp.task('default', ['build']);