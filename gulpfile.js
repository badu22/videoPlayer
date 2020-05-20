/* --------------------------------------------------------------------------- */
/* Install instructions
/* --------------------------------------------------------------------------- */
// Run gulp
// > gulp

/* --------------------------------------------------------------------------- */
/* Packages
/* --------------------------------------------------------------------------- */
const {
    src,
    dest,
    watch,
    series,
    parallel
}                   = require('gulp');
const sourcemaps    = require('gulp-sourcemaps');
const sass          = require('gulp-sass');
const concat        = require('gulp-concat');
const uglify        = require('gulp-uglify');
const postcss       = require('gulp-postcss');
const autoprefixer  = require('autoprefixer');
const cssnano       = require('cssnano');
var replace         = require('gulp-replace');
const babel         = require('gulp-babel');
const plumber       = require('gulp-plumber');



/* --------------------------------------------------------------------------- */
/* Defaults
/* --------------------------------------------------------------------------- */
const files = { 
    scssPath: 'src/scss/**/*.scss',
    jsPath: 'src/js/**/*.js'
}


/* --------------------------------------------------------------------------- */
/* SCSS
/* --------------------------------------------------------------------------- */
function scssTask() {
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist')
    );
}

// --------------------------------------------------------------------------- //
// Scripts
// --------------------------------------------------------------------------- //
function jsTask() {
    return src([
        './node_modules/navigo/lib/navigo.min.js',
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/plyr/dist/plyr.polyfilled.min.js',
        './node_modules/plyr/dist/plyr.min.js',
        files.jsPath
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        // Stop the process if an error is thrown.
        // .pipe(plumber())
        // // Transpile the JS code using Babel's preset-env.
        // .pipe(babel({
        //     presets: [
        //         ['@babel/env', {
        //             modules: false
        //         }]
        //     ]
        // }))
        .pipe(concat('main.js'))
        .pipe(dest('dist')
    );
}

/* --------------------------------------------------------------------------- */
/* Cachebust
/* --------------------------------------------------------------------------- */
function cacheBustTask(){
    var cbString = new Date().getTime();
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}

/* --------------------------------------------------------------------------- */
/* Watch
/* --------------------------------------------------------------------------- */
function watchTask(){
    watch([files.scssPath, files.jsPath],
        {interval: 1000, usePolling: true}, //Makes docker work
        series(
            parallel(scssTask, jsTask),
            cacheBustTask
        )
    );    
}

/* --------------------------------------------------------------------------- */
/* Init
/* --------------------------------------------------------------------------- */
// exports.default = series(clean, parallel(css, javascript));
exports.default = series(
    parallel(scssTask, jsTask),
    cacheBustTask,
    watchTask
);


