/**
 * Created by jmbradd on 11/6/2015.
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass');

gulp.task('default', ['watch']);

gulp.task('jshint',function(){
    return gulp.src('source/javascript/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function(){
    return gulp.src('source/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('watch', function(){
    gulp.watch('source/javascript/**/*.js', ['jshint']);
    gulp.watch('source/scss/**/*.scss', ['build-css']);
});


