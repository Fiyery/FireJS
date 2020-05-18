"use strict";

const gulp = require("gulp");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const uglifycss = require("gulp-uglifycss");
const imagemin = require("gulp-imagemin");
const pngquant = require("imagemin-pngquant");
const babel = require('gulp-babel');
const rename = require("gulp-rename");
 
function image_task() {
	return gulp.src("res/img/**/*", {since: gulp.lastRun(image_task)})
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest("res/dist/img"));
}

function js_task() {
	return gulp.src(["res/js/main/*.js", "res/js/component/**/*.js", "src/module/**/**/res/js/*.js"])
        .pipe(concat("min.js"))
        .pipe(babel({
            presets: [
                '@babel/preset-env',
                {
                    'plugins': ['@babel/plugin-proposal-class-properties']
                }
            ]
        }))
        .pipe(gulp.dest("res/dist"))
        .pipe(uglify())
        .pipe(gulp.dest("res/dist"));
}
 
function sass_task() {
	return gulp.src(["res/sass/**/*.scss", "res/js/component/**/*.scss", "src/module/**/**/res/sass/*.scss"])
		.pipe(concat("min.css"))
		.pipe(sass().on("error", sass.logError))
		.pipe(uglifycss({
			"maxLineLen": 80,
			"uglyComments": true
	    }))	
		.pipe(gulp.dest("res/dist"));
}
 
function watch_task() {
	gulp.watch([
        "res/sass/**/*.scss", 
        "res/js/component/**/*.scss", 
        "src/module/**/**/res/sass/*.scss"
    ], gulp.series(sass_task)).on("change", function(event){
		console.log("...");
	});
	gulp.watch([
        "res/js/**/*.js", 
        "src/module/**/**/res/js/*.js"
    ], gulp.series(js_task)).on("change", function(event){
		console.log("...");
	});
}

function js_lib_task() {
	return gulp.src(["res/js/main/01_firejs.js"])
        .pipe(babel({
            presets: [
                '@babel/preset-env',
                {
                    'plugins': ['@babel/plugin-proposal-class-properties']
                }
            ]
        }))
        .pipe(rename("firejs.min.js"))
        .pipe(gulp.dest("res/dist"))
        .pipe(uglify())
        .pipe(gulp.dest("res/dist"));
}

module.exports = {
    default: gulp.series(js_task, sass_task, image_task),
    watch: gulp.series(watch_task),
    lib: gulp.series(js_lib_task)
}

