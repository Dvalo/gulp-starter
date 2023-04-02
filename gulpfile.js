const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')
const plumber = require('gulp-plumber')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const dependents = require('gulp-dependents')
const browserSync = require('browser-sync').create()

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css',
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js',
  },
  html: {
    src: 'src/*.html',
    dest: 'dist',
  },
}

const css = () => {
  return gulp
    .src(paths.styles.src)
    .pipe(plumber())
    .pipe(dependents())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())
}

const js = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(plumber())
    .pipe(dependents())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream())
}

const html = () => {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream())
}

const watch = () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
    port: 3000,
  })
  gulp.watch('src/scss/**/*.scss', css)
  gulp.watch('src/js/**/*.js', js)
  gulp.watch('src/*.html', html)
}

gulp.task('css', css)
gulp.task('js', js)
gulp.task('html', html)
gulp.task('watch', watch)

gulp.task('default', gulp.series(gulp.parallel(css, js, html), watch))
