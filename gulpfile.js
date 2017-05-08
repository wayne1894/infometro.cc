var gulp = require('gulp')
var gulpPlumber = require('gulp-plumber');// 錯誤處理

//gulp-webserver
var webserver = require('gulp-webserver');
gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      port:1313,
      livereload: true,
      directoryListing: false,
      open: "404.html"
    }));
});

//gulp-less
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');
gulp.task('less', function () {
  return gulp.src('develop/css/*.less')
  .pipe(gulpPlumber())
  .pipe(less())
  .pipe(cssmin())
  .pipe(gulp.dest('src/build/css'));
});


//gulp-file-include
var fileinclude = require('gulp-file-include')
gulp.task('fileinclude', function() {
  gulp.src(['develop/*.html'])
	.pipe(gulpPlumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./'));
});

// gulp-uglify
var gulpUglify = require('gulp-uglify'); 

gulp.task('script', function () {
	gulp.src('develop/js/*.js')
	.pipe(gulpPlumber())
	.pipe(gulpUglify()) 
	.pipe(gulp.dest('src/build/js'));
});



//即時監控
//develop watch下的檔案 新增資料夾重新命名會出錯 
gulp.task('watch', function () {
	gulp.watch(['develop/*.html'], ['fileinclude']);
	gulp.watch(['develop/include/*.html'], ['fileinclude']);
	gulp.watch(['develop/css/*.less'], ['less']);
	gulp.watch(['develop/js/*.js'], ['script']);
})


//預設執行
gulp.task('default', ['watch', 'fileinclude', 'less', 'webserver','script']);
