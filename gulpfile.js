const gulp = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const pug = require('gulp-pug');
const glob = require('glob');
const path = require('path');
const pageDecl = require('./page.decl.js');

function getBuildLevel() {
    const levelIndex = process.argv.indexOf('--level');

    if (levelIndex === -1 || !process.argv[levelIndex + 1]) {
        return 'desktop';
    }

    return process.argv[levelIndex + 1];
}

function collectBlockCssFiles(levelName) {
    const levels = ['common.blocks'];

    if (levelName === 'mobile') {
        levels.push('mobile.blocks');
    }

    const cssFiles = [];

    pageDecl.blocks.forEach(function (block) {
        levels.forEach(function (levelDir) {
            const pattern = path.join(levelDir, block.name, '**', '*.css').replace(/\\/g, '/');
            const matchedFiles = glob.sync(pattern, { nodir: true });

            matchedFiles.sort();
            cssFiles.push(...matchedFiles);
        });
    });

    return cssFiles;
}

function buildCSS() {
    const levelName = getBuildLevel();
    const cssFiles = collectBlockCssFiles(levelName);

    return gulp
        .src(cssFiles, { allowEmpty: false })
        .pipe(concat('bundle.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist'));
}

function buildJS() {
    return gulp
        .src('src/js/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
}

function buildHTML() {
    return gulp
        .src('src/pug/pages/*.pug')
        .pipe(
            pug({
                pretty: true
            })
        )
        .pipe(gulp.dest('.'));
}

function getCssWatchGlobs(levelName) {
    const levels = ['common.blocks'];

    if (levelName === 'mobile') {
        levels.push('mobile.blocks');
    }

    return pageDecl.blocks.map(function (block) {
        return levels.map(function (levelDir) {
            return path.join(levelDir, block.name, '**', '*.css').replace(/\\/g, '/');
        });
    }).flat();
}

function watchFiles() {
    const levelName = getBuildLevel();

    gulp.watch(getCssWatchGlobs(levelName), buildCSS);
    gulp.watch('src/js/**/*.js', buildJS);
    gulp.watch('src/pug/**/*.pug', buildHTML);
}

const build = gulp.parallel(buildCSS, buildJS, buildHTML);

exports.buildCSS = buildCSS;
exports.buildJS = buildJS;
exports.buildHTML = buildHTML;
exports.watch = gulp.series(build, watchFiles);
exports.build = build;
exports.default = build;
