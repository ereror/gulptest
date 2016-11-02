var gulp = require('gulp');
var less = require('gulp-less');
var jade = require('gulp-jade');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var del  = require('del');
var path = require('path');
var cached = require('gulp-cached');
var browserSync = require('browser-sync').create();
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('gulp-watchify');
var rename = require('gulp-rename');
var streamify = require('gulp-streamify');
var plumder = require('gulp-plumber');
var babel = require('gulp-babel');
var seq   = require('gulp-sequence');
var argv = require('argv');
var eslint = require('gulp-eslint');

var TMP_FOLDER ='tmp/';

var DEPLOY_FOLDER ='build';

var JSS=["src/app/**/*.js",'!src/app/module/*.js'];
var CSSDIR=["src/assets/style/**/*.less"];
var VIEWS=["src/views/**/*.jade"];
var IMAGES=["src/assets/image/**/*"];
var FOLDER=TMP_FOLDER;
var TYPE="DEV";

var config={
    watch:true,
    cache:{},
    packageCache:{},
    setup:function(bundle){
        bundle.transform('bulkify');
        bundle.transform("babelify",{"presets": ["es2015"]});
    }
};

gulp.task('clear', function(cb){
    del([FOLDER],cb);
});

gulp.task('lint',function(){
    return gulp.src('src/app/**/*.js').pipe(eslint()).pipe(eslint.format());
});
//引入最新babelify模块才能编译成功
gulp.task('modulejs', function(){
    return browserify('./src/app/module/main.js')
    .transform(babelify,{presets:['es2015']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(FOLDER+"scripts"));
});

//浏览器模块
gulp.task("bundle", watchify(function(wf){
    return gulp.src(JSS)
           .pipe(plumder())
           .pipe(wf(config))
           .pipe(buffer())
           .pipe(gulp.dest(FOLDER+"scripts"));
}));

gulp.task("compile-lib", function(){
    return gulp.src(["libs/**/*"])
    .pipe(gulp.dest(FOLDER+"libs"));
});

gulp.task("compile-views",function(){
     var config={time:"?v="+new Date().getTime()};
     return gulp.src(VIEWS)
            .pipe(cached("debug",{optimizeMemory:true}))
            .pipe(jade({locals:config}))
            .on("error",function(error){console.dir(error);this.emit('end');})
            .pipe(gulp.dest(FOLDER));
});

gulp.task("compile-style",function(){
    return gulp.src(CSSDIR)
        .pipe(less())
        .on("error",function(error){console.dir(error);this.emit('end');})
        .pipe(gulp.dest(FOLDER+"assets/style"));
});

gulp.task("compile-image",function(){
    return gulp.src(IMAGES,{base:"src"})
        .pipe(cached("debug",{optimizeMemory:true}))
        .pipe(gulp.dest(FOLDER));
});

gulp.task("watch",function(){
    gulp.watch(VIEWS,["compile-views"]);
    gulp.watch(CSSDIR,["compile-style"]);
    gulp.watch(IMAGES,["compile-image"]);
    gulp.watch(JSS,["bundle"]);
    gulp.watch('src/app/module/*.js',['modulejs']);
    gulp.watch(FOLDER+"**/*",{read:false}).on('change', function(event){
        browserSync.reload();
    });
});

gulp.task("default",["bundle","modulejs","compile-views","compile-lib","compile-style","compile-image"]);

gulp.task("dev",["default"],function(){
    console.log("##Starting Server.......");
    browserSync.init({
        //proxy:'代理地址',
        port:8989,
        //startPath:"开始路径",
        ghostMode:false,
        server:FOLDER,
        open: true
        //middleware: [proxy]//代理服务器
    });
    gulp.start("watch");
});

gulp.task("server",['dev']);
