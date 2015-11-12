var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    del = require('del'),
    sass = require('gulp-sass'),
    debug = require('gulp-debug'),
//    karma = require('gulp-karma'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
//    spritesmith = require('gulp.spritesmith'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    debowerify = require('debowerify'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    mainBowerFiles = require('main-bower-files'),
    wiredep = require('wiredep').stream,
    ngAnnotate = require('browserify-ngannotate');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

var config = {
    sassFolder:     'app/styles/**/*',
    jsFolder:       'app/scripts/**/*',
    viewsFolder:    'app/views/**/*',
    fontsFolder:    'fonts',
    destFolder:     'dist',
    mapsFolder:     'maps',
    bowerFolder:    'bower_components', 
};


/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the build output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function (cb) {
    return del([
        config.destFolder
    ], cb);
});


/////////////////////////////////////////////////////////////////////////////////////
//
// runs bower to install frontend dependencies
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('install-bower', function() {

    var install = require("gulp-install");

    return gulp.src(['./bower.json'])
        .pipe(install());
});


/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-css', ['clean'], function() {
    return gulp.src(config.sassFolder)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.sassFolder,
                config.bowerFolder
            ],
            errLogToConsole: true
        }))
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write(config.mapsFolder))
        .pipe(gulp.dest(config.destFolder + '/styles/'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// runs sass, creates css source maps for bower components
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-bower-css', ['clean'], function() {
    return gulp.src(mainBowerFiles({
        filter: /.*s?(c|a)ss$/
    }))
//        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: [
                config.bowerFolder
            ],
            errLogToConsole: true
        }))
        .pipe(concat('vendor.css'))
        .pipe(cachebust.resources())
        .pipe(sourcemaps.write(config.mapsFolder))
        .pipe(gulp.dest(config.destFolder + '/styles/'));
});


/////////////////////////////////////////////////////////////////////////////////////
//
// runs jshint
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('jshint', function() {
    gulp.src(config.jsFolder)
        .pipe(debug())
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// fills in the Angular template cache, to prevent loading the html templates via
// separate http requests
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-template-cache', ['clean'], function() {

    var ngHtml2Js = require("gulp-ng-html2js"),
        concat = require("gulp-concat");
    
    return gulp.src(config.viewsFolder)
        .pipe(ngHtml2Js({
            moduleName: "4meCdsPartials",
            prefix: "views/"
        }))
        .pipe(concat("templateCachePartials.js"))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(config.destFolder + '/scripts/'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle - the order of the js files is determined
// by browserify
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-js', ['clean'], function() {

    return gulp.src(config.jsFolder)
        .pipe(concat('bundle.js'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(config.destFolder + '/scripts/'));

    var b = browserify({
        entries: 'app/scripts/app.js',
        debug: true,
        paths: [config.jsFolder],
        transform: [ngAnnotate]
    });

    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(cachebust.resources())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write(config.mapsFolder))
        .pipe(gulp.dest(config.destFolder + '/scripts/'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle of bower_components
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-bower-js', ['clean'], function() {
    return gulp.src(mainBowerFiles({
        filter: /.*\.js$/
    }))
        .pipe(debug())
        .pipe(concat('vendor.js'))
        .pipe(cachebust.resources())
        .pipe(gulp.dest(config.destFolder + '/scripts/'));
});


/////////////////////////////////////////////////////////////////////////////////////
//
// Build a minified Javascript bundle of bower_components
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build-bower-fonts', ['clean'], function() {
    return gulp.src(mainBowerFiles({
        filter: /.*\.(woff2|eot|woff|ttf|svg)$/
    }))
        .pipe(debug())
        .pipe(gulp.dest(config.destFolder + '/fonts/'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// full build (except sprites), applies cache busting to the main page css and js bundles
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('build', [ 'clean', 'install-bower', 'build-css', 'build-bower-css', 'build-bower-fonts', 'build-template-cache', 'jshint', 'build-js', 'build-bower-js'], function() {
    return gulp.src('app/index.html')
        .pipe(cachebust.references())
        .pipe(gulp.dest('dist'));
});