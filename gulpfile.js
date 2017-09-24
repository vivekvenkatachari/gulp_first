// include gulp
var gulp = require('gulp');
var wiredep = require('wiredep'); 

// include plug-ins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');

// JS hint task
gulp.task('jshint', function() {
  gulp.src('./src/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src(['./src/scripts/lib.js','./src/scripts/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts/'));
});

var server = require('karma').Server;

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  new server({
    configFile: require('path').resolve('my.conf.js'),
    singleRun: true
  }, done).start();
});

gulp.task('vendor-scripts', ['scripts'], function() {
	return gulp.src(wiredep().js)
  .pipe(uglify())
	.pipe(gulp.dest('build/vendor'));
});

gulp.task('vendor-css', function() {
    
      return gulp.src(wiredep().css)
    
        .pipe(gulp.dest('build/vendor'));
    
    });
gulp.task('index', ['vendor-scripts', 'vendor-css'], function() {

  return gulp.src('src/index.html')
    .pipe(wiredep.stream({
      fileTypes: {
        html: {
          replace: {
            js: function(filePath) {
              return '<script src="' + 'vendor/' + filePath.split('/').pop() + '"></script>';
            },
            css: function(filePath) {
                  return '<link rel="stylesheet" href="' + 'vendor/' + filePath.split('/').pop() + '"/>';
              }
            
          }
        }
      }
    }))

    .pipe(gulp.dest('build'));
});

gulp.task('default', ['jshint', 'scripts'], function() {
});