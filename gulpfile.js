var gulp = require('gulp')

//gulp-less
var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
  return gulp.src('css/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('css'));
});



//即時監控
gulp.task('watch', function () {
	gulp.watch(['./css/*.less'], ['less']);
})