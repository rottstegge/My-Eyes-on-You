var gulp =      require('gulp');
var sass =      require('gulp-sass');
var babel =     require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var webserver = require('gulp-webserver');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


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
  gulp.watch('js/**/*.js', gulp.series('scripts'));

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


gulp.task('scripts', function() {
  return browserify({
      entries: 'js/main.js',
      debug: true
    })
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('app.bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./maps'))

    // Start piping stream to tasks!
    .pipe(gulp.dest('public/js/'));
});




gulp.task('default', gulp.parallel('watch', 'webserver'));
