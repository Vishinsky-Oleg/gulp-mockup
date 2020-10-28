const gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,
    sass = require("gulp-sass"),
    cleanCSS = require("gulp-clean-css"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    lineec = require("gulp-line-ending-corrector");

const root = "../"; //Root folder
const scss = root + "src/sass/", //Folder with scss files
    js = root + "src/js/", //folder with js files
    vendor = js + "vendor/", //JS vendors
    jsdist = root + "dist/js/", //folder to place minified version of js
    cssdist = root + "dist/css/"; //folder for final css file

const twigWatchFiles = root + "**/*.twig", //Files that is gonna be changed
    styleWatchFiles = scss + "**/*.sass"; //if scss is changed

const jsSRC = [
    //order in which js files will be processed
    js + "main.js",
    vendor + "jquery-2.1.1.min.js",
    vendor + "bootstrap.js",
    vendor + "jquery.magnific-popup.min.js",
];

const cssSRC = [
    //order in which css files will be processed
    root + "src/css/vendor/bootstrap.css", //css vendors
    root + "src/css/style.css", //compiled sass
];

function css() {
    return gulp
        .src([scss + "style.sass"]) //sass file to compile
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(
            sass({
                outputStyle: "expanded",
            }).on("error", sass.logError)
        )
        .pipe(autoprefixer("last 2 versions"))
        .pipe(sourcemaps.write())
        .pipe(lineec())
        .pipe(gulp.dest(root + "src/css/")); //compiled sass goes into
}

function concatCSS() {
    return gulp
        .src(cssSRC) //array with all css files with particular order
        .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
        .pipe(concat("style.min.css")) //name of minified final css file
        .pipe(cleanCSS())
        .pipe(sourcemaps.write("./")) //css maps gonna go in the same folder as final file
        .pipe(lineec())
        .pipe(gulp.dest(cssdist)); //destination of final minified version
}

function javascript() {
    return gulp
        .src(jsSRC) //minify array of js files ordered in particular maner
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(lineec())
        .pipe(gulp.dest(jsdist)); //destination for final minified js script
}

function watch() {
    browserSync.init({
        server: {
            baseDir: root, //base directory to run localhost
        },
    });
    gulp.watch(styleWatchFiles, gulp.series([css, concatCSS]));
    gulp.watch(jsSRC, javascript);
    gulp.watch([jsdist + "main.js", cssdist + "style.min.css"]).on(
        "change",
        browserSync.reload
    );
}
//exporting functions
exports.css = css;
exports.concatCSS = concatCSS;
exports.javascript = javascript;
exports.watch = watch;

const build = gulp.parallel(watch);
gulp.task("default", build);

/////CHANGE SASS TO SCSS if needed
