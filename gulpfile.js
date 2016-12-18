'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var srcPath = './src/';
var distPath = './dist/';

gulp.task('build-core',function () {
    return gulp.src(srcPath+'grid.js')
        .pipe(concat('grid-core.js'))
        .pipe(gulp.dest(distPath));
});

gulp.task('build-full',function () {
    return gulp.src([
        srcPath+'grid.js',
        srcPath+'plugins/limit.js',
        srcPath+'plugins/pagination.js',
        srcPath+'plugins/search.js',
        srcPath+'plugins/filters.js'
    ])
        .pipe(concat('grid-full.js'))
        .pipe(gulp.dest(distPath));
});


gulp.task('build-core-min',function () {
    return gulp.src(srcPath+'grid.js')
        .pipe(concat('grid-core.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distPath));
});

gulp.task('build-full-min',function () {
    return gulp.src([
        srcPath+'grid.js',
        srcPath+'plugins/limit.js',
        srcPath+'plugins/pagination.js',
        srcPath+'plugins/search.js',
        srcPath+'plugins/filters.js'
    ])
        .pipe(concat('grid-full.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(distPath));
});