var gulp = require('gulp')
var gulpPlumber = require('gulp-plumber');// 錯誤處理

//gulp-webserver
var webserver = require('gulp-webserver');
gulp.task('webserver', function() {
  gulp.src('./public')
    .pipe(webserver({
      port:1313,
      livereload: true,
      directoryListing: false,
      open: "main.html"
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
  .pipe(gulp.dest('./public/src/build/css'));
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
	.pipe(gulp.dest('./public'));
});

// gulp-uglify
var gulpUglify = require('gulp-uglify'); 
// gulp-concatnpm 
var concat= require('gulp-concat');
// merge-stream
var merge= require('merge-stream');

gulp.task('concat', function() { //合併與最小化檔案
	var concat1=gulp.src(['develop/js/main.js', 'develop/js/top.js', 'develop/js/bottom.js','develop/js/left.js','develop/js/right.js','develop/js/center.js','develop/js/vm.js'])
        .pipe(gulpPlumber())
        .pipe(concat('main.js'))
		.pipe(gulpUglify())
		.pipe(gulp.dest('./public/src/build/js'));
	var concat2= gulp.src(['develop/js/firebase_init.js'])
		.pipe(gulpPlumber())
		.pipe(gulpUglify())
		.pipe(gulp.dest('./public/src/build/js'));
	return merge(concat1, concat2);
});


//即時監控
//develop watch下的檔案 新增資料夾重新命名會出錯 
gulp.task('watch', function () {
	gulp.watch(['develop/*.html'], ['fileinclude']);
	gulp.watch(['develop/include/*.html'], ['fileinclude']);
	gulp.watch(['develop/css/*.less'], ['less']);
	gulp.watch(['develop/js/*.js'], ['concat']);
})


//預設執行
gulp.task('default', ['watch','fileinclude', 'less', 'webserver','concat']);
