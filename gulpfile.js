var gulp = require('gulp')

//gulp-less
var less = require('gulp-less');
var path = require('path');
gulp.task('less', function () {
  return gulp.src('develop/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('css'));
});


//gulp-file-include
var fileinclude = require('gulp-file-include')
gulp.task('fileinclude', function() {
  gulp.src(['develop/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});


//即時監控
gulp.task('watch', function () {
	gulp.watch(['develop/*.html'], ['fileinclude']);
	gulp.watch(['develop/include/*.html'], ['fileinclude']);
	gulp.watch(['develop/less/*.less'], ['less']);
})

//預設執行
gulp.task('default', ['watch', 'fileinclude', 'less']);


