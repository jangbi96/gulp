var gulp = require('gulp'),
      uglify = require('gulp-uglify'),
      sass = require('gulp-sass'),
      minificss = require('gulp-minify-css'),
      del = require('del'),
      browserSync = require('browser-sync').create();
      fileinclude = require('gulp-file-include');
      include = require('gulp-html-tag-include');

var devsrc = './src/';
var pubsrc = './dist/';
var paths = {
    "dev" : {
        "css" : devsrc + 'scss/*.scss',
        "js" : devsrc + 'js/*.js',
        "html" : devsrc + '*.html',
        "include" : devsrc + 'include/*.html'
    },
    "pub" : {
        "css" : pubsrc + 'css',
        "js" : pubsrc + 'js',
        "html" : pubsrc
    }
};   



gulp.task('fileinclude', function() {
    return gulp.src([
        "./src/*.html", // ★★★★ 불러올 파일의 위치
        "!" + "./src/include/*" // ★★★★ 읽지 않고 패스할 파일의 위치
    ])
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
        }))
    .pipe(gulp.dest('./dist/')) // ★★★★ 변환한 파일의 저장 위치 지정
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('gulp_js', function(){
    return gulp.src(paths.dev.js, {sourcemaps: true})
    .pipe(uglify())
    .pipe(gulp.dest(paths.pub.js))
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('gulp_css', function(){
    return gulp.src(paths.dev.css)
    .pipe(sass().on('error', sass.logError))
    // .pipe(minificss())
    .pipe(gulp.dest(paths.pub.css))
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('gulp_html', function(){
    return gulp.src(paths.dev.html)
    .pipe(gulp.dest(paths.pub.html))
    .pipe(browserSync.reload({ stream : true }));
});

gulp.task('html-include', function() {
    return gulp.src('./src/*.html')
        .pipe(include())
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.reload({ stream : true }));
});



gulp.task('gulp_watch', function(){
    // gulp.watch(paths.dev.include, gulp.series('fileinclude'));
    gulp.watch(paths.dev.css, gulp.series('gulp_css'));
    gulp.watch(paths.dev.js, gulp.series('gulp_js'));
    // gulp.watch(paths.dev.html, gulp.series('gulp_html'));
    gulp.watch(paths.dev.include , gulp.series('fileinclude'));
    gulp.watch(paths.dev.html , gulp.series('fileinclude'));
    
});

gulp.task('clean', function(){
    del([pubsrc + '/css/*.css']);
    del([pubsrc + '/js/*.js']);
});

gulp.task('browserSync', function () {
    return browserSync.init({ port : 8001, server: { baseDir: pubsrc } });
});

gulp.task('default', gulp.parallel('browserSync', 'gulp_css', 'gulp_js', 'gulp_watch'  , 'fileinclude' ));
gulp.task('dev',gulp.parallel('clean','browserSync', 'gulp_css', 'gulp_js', 'gulp_watch'  , 'fileinclude'));