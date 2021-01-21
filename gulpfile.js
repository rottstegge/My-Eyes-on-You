var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');


//style paths
var sassFiles = 'scss/**/*.scss';
var cssDest = 'public/css';



gulp.task('styles', async function(){
    gulp.src('scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDest));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(sassFiles, gulp.series('styles'));
});
 

gulp.task('webserver', function() {
  gulp.src('public')
    .pipe(webserver({
      port: 12345,
      livereload: true,
      //directoryListing: true,
      open: true
    }));
});

gulp.task('default', gulp.parallel('watch', 'webserver'));
