//load plugins
var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');

//define a task called css
gulp.task('css', function() {
  //grab less file - process and save to style.css
  return gulp.src('public/assets/css/style.less')
    .pipe(less())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('public/assets/css'));
});

gulp.task('js', function() {
  return gulp.src(['server.js', 'public/app/*.js', 'public/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//gulp.task('scripts', function() {
  //return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
    //.pipe(jshint())
    //.pipe(jshint.reporter('default'))
    //.pipe(concat('all.js'))
    //.pipe(uglify())
    //.pipe(gulp.dest('public/dist'));
//});

gulp.task('angular', function() {
  return gulp.src(['public/app/*.js', 'public/app/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(ngAnnotate())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('watch', function() {
  //watch less files and run the css task
  gulp.watch('public/assets/css/style.less', ['css']);

  //watch js files and run jshint and angular tasks
  gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], ['js', 'angular']);
});

gulp.task('nodemon', function() {
  nodemon({
    script: 'server.js',
    ext: 'js less html'
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function() {
      console.log('Restarted!');
    });
});

gulp.task('default', ['nodemon']);
